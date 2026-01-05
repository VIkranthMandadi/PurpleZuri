import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { Order, CreateOrderRequest, OrderStatus } from '../../shared/models/order.model';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // Get all orders
  async getOrders(): Promise<Order[]> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Order[];
  }

  // Get order by ID (for customer tracking)
  async getOrderById(id: string): Promise<Order | null> {
    const { data, error } = await this.supabase.from('orders').select('*').eq('id', id).single();

    if (error) throw error;
    return data as Order;
  }

  // Create new order
  async createOrder(order: CreateOrderRequest): Promise<Order> {
    const { data, error } = await this.supabase.from('orders').insert([order]).select().single();

    if (error) throw error;
    return data as Order;
  }

  // Update order status
  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const { data, error } = await this.supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Order;
  }
}
