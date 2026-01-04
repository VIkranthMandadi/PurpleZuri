import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase: SupabaseClient;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private currentProfileSubject = new BehaviorSubject<UserProfile | null>(null);

  public currentUser$: Observable<User | null>;
  public currentProfile$: Observable<UserProfile | null>;
  public isAuthenticated$: Observable<boolean>;
  public isAdmin$: Observable<boolean>;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    // Initialize observables
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.currentProfile$ = this.currentProfileSubject.asObservable();
    this.isAuthenticated$ = this.currentUser$.pipe(map((user) => !!user));
    this.isAdmin$ = this.currentProfile$.pipe(map((profile) => profile?.is_admin ?? false));

    // Initialize: Get current session and user
    this.init();
  }

  private async init(): Promise<void> {
    // Get current session
    const {
      data: { session },
    } = await this.supabase.auth.getSession();

    if (session?.user) {
      this.currentUserSubject.next(session.user);
      await this.loadUserProfile(session.user.id);
    }

    // Listen for auth changes
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        this.currentUserSubject.next(session.user);
        await this.loadUserProfile(session.user.id);
      } else {
        this.currentUserSubject.next(null);
        this.currentProfileSubject.next(null);
      }
    });
  }

  /**
   * Login with email and password
   */
  async login(
    email: string,
    password: string
  ): Promise<{ user: User | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error };
      }

      if (data.user) {
        this.currentUserSubject.next(data.user);
        await this.loadUserProfile(data.user.id);
      }

      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.supabase.auth.signOut();

      if (error) {
        return { error };
      }

      this.currentUserSubject.next(null);
      this.currentProfileSubject.next(null);

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Get current user profile
   */
  getCurrentProfile(): UserProfile | null {
    return this.currentProfileSubject.value;
  }

  /**
   * Check if current user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  /**
   * Check if current user is admin
   */
  isAdmin(): boolean {
    return this.currentProfileSubject.value?.is_admin ?? false;
  }

  /**
   * Load user profile from profiles table
   */
  private async loadUserProfile(userId: string): Promise<void> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        this.currentProfileSubject.next(null);
        return;
      }

      this.currentProfileSubject.next(data as UserProfile);
    } catch (error) {
      console.error('Error loading user profile:', error);
      this.currentProfileSubject.next(null);
    }
  }

  /**
   * Get Supabase client (for advanced usage)
   */
  getSupabaseClient(): SupabaseClient {
    return this.supabase;
  }
}
