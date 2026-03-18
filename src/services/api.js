
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://eilpafndxtzsmxozrpnm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpbHBhZm5keHR6c214b3pycG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTcwMzUsImV4cCI6MjA4MDg3MzAzNX0.yFiNZ1W9YmrJbMx-2_YPdgfgZ2qYWUMk4xjPLDlN9hk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const api = {
    // Products
    getProducts: async () => {
        let { data, error } = await supabase
            .from('products')
            .select('*');
        if (error) console.error('Error fetching products', error);
        return data || [];
    },

    // Tables
    getTables: async () => {
        let { data, error } = await supabase
            .from('tables')
            .select('*, orders(*), establishment:establishments(*)')
            .order('number');
        if (error) console.error('Error fetching tables', error);
        return data || [];
    },
    getTable: async (id) => {
        let { data, error } = await supabase
            .from('tables')
            .select('*, orders(*)')
            .eq('id', id)
            .single();
        if (error) console.error('Error fetching table', error);
        return data;
    },
    // Orders
    addOrder: async (tableId, orderItem) => {
        // Just insert into orders table. Realtime triggers will handle the rest.
        const { data, error } = await supabase
            .from('orders')
            .insert([{
                table_id: tableId,
                product_id: orderItem.productId,
                name: orderItem.name,
                price: orderItem.price,
                quantity: orderItem.quantity,
                status: 'pending',
                ordered_by: orderItem.orderedBy
            }])
            .select();

        // Also update table status to occupied if needed
        await supabase
            .from('tables')
            .update({ status: 'occupied' })
            .eq('id', tableId);

        if (error) console.error('Error adding order', error);
        return data;
    },

    // Suppliers (Shared with B2B)
    getSuppliers: async (establishmentId) => {
        let query = supabase.from('suppliers').select('*');
        if (establishmentId) query = query.eq('establishment_id', establishmentId);
        let { data, error } = await query.order('name');
        if (error) console.error(error);
        return data || [];
    },

    // Inventory
    getInventory: async (establishmentId) => {
        let query = supabase.from('inventory').select('*, suppliers(*)');
        if (establishmentId) query = query.eq('establishment_id', establishmentId);
        let { data, error } = await query;
        if (error) console.error(error);
        return data || [];
    },
    createInventoryItem: async (itemData) => {
        const { data, error } = await supabase
            .from('inventory')
            .insert([itemData])
            .select();
        if (error) throw error;
        return data[0];
    },
    updateInventoryItem: async (id, updates) => {
        const { data, error } = await supabase
            .from('inventory')
            .update(updates)
            .eq('id', id)
            .select();
        if (error) throw error;
        return data;
    },
    deleteInventoryItem: async (id) => {
        const { error } = await supabase
            .from('inventory')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    },

    // Establishments
    getEstablishments: async (ownerId) => {
        let query = supabase.from('establishments').select('*');
        if (ownerId) query = query.eq('owner_id', ownerId);
        let { data, error } = await query;
        if (error) console.error(error);
        return data || [];
    },
    getEstablishmentById: async (id) => {
        const { data, error } = await supabase
            .from('establishments')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return { data };
    },
    uploadLogo: async (file, establishmentId) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${establishmentId}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase.storage
            .from('logos')
            .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('logos')
            .getPublicUrl(filePath);

        return publicUrl;
    },
    createEstablishment: async (estabData, ownerId) => {
        const { data, error } = await supabase
            .from('establishments')
            .insert([{ 
                name: estabData.name, 
                type: estabData.type,
                logo_url: estabData.logo_url || null,
                theme_color: estabData.theme_color || '#6366f1',
                theme_secondary_color: estabData.theme_secondary_color || '#4338ca',
                theme_background_color: estabData.theme_background_color || '#0f172a',
                owner_id: ownerId 
            }])
            .select();
        if (error) throw error;
        return data[0];
    },
    updateEstablishment: async (id, updates) => {
        const { data, error } = await supabase
            .from('establishments')
            .update(updates)
            .eq('id', id)
            .select();
        if (error) throw error;
        return data;
    },
    deleteEstablishment: async (id) => {
        const { error } = await supabase
            .from('establishments')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    },

    // Users (Auth - GoTrue)
    signUpBase: async (email, password, metaData) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: metaData }
        });
        if (error) throw error;
        return data;
    },
    loginBase: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return data;
    },
    logoutBase: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }
};
