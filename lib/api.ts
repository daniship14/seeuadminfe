import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://seeu-api.prometteur.in';

const api = axios.create({
  baseURL: BASE_URL,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
    headers: {
    'Content-Type': 'application/json',
    apikey: 'IntegrationsServiceAPIKey123',
    apisecrete: 'IntegrationsServiceAPISecrete123',
  },
});

// Request interceptor - attach token
api.interceptors.request.use((config) => {
  const token = Cookies.get('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message?.toLowerCase?.() || '';

    const tokenExpired =
      status === 401 ||
      status === 403 ||
      message.includes('token expired') ||
      message.includes('please login') ||
      message.includes('acces token expired');

    if (tokenExpired) {
      Cookies.remove('admin_token');

      if (typeof window !== 'undefined') {
        window.location.replace('/login');
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// ─── Auth ────────────────────────────────────────────────────────────────────
export const adminLogin = (email: string, password: string) =>
  api.post('/admin/login', { email, password });

export const adminLogout = () => api.post('/admin/logout');

// ─── Dashboard ───────────────────────────────────────────────────────────────
export const getDashboardMetrics = (filter = 'daily') =>
  api.get(`/admin/dashboard/metrics?filter=${filter}`);

export const getRevenueOverview = (overviewType = 'monthly', year?: number) =>
  api.get(`/api/dashboard/revenue-overview?overview_type=${overviewType}${year ? `&year=${year}` : ''}`);

export const getDashboardDetails = (overviewType: string) =>
  api.get(`/api/dashboard/dashboard-details/?overview_type=${overviewType}`);

// ─── Users ───────────────────────────────────────────────────────────────────
export const listUsers = (params: {
  search?: string;
  gender?: string;
  persona_type?: string;
  status?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  page_size?: number;
}) => api.get('/admin/users', { params });

export const blockUnblockUser = (user_id: string, block: boolean) =>
  api.post('/admin/users/block', { user_id, block });

export const getUserProfile = (profile_id: string) =>
  api.get(`/api/users/profile/${profile_id}`);

// ─── Subscriptions ───────────────────────────────────────────────────────────
export const getAdminPlans = (plan_id?: string) =>
  api.get('/api/subscription/admin/get_plans_list', { params: { plan_id } });

export const createSubscriptionPlan = (data: {
  plan_name: string;
  plan_price: number;
  plan_duration: 'week' | 'month' | 'year';
  plan_feature: string[];
  plan_description: string;
}) => api.post('/api/subscription/admin/create_subscription', data);

export const updateSubscriptionPlan = (plan_id: string, data: {
  plan_name?: string;
  plan_feature?: string[];
  plan_description?: string;
}) => api.patch(`/api/subscription/admin/update_subscription/${plan_id}`, data);

export const deleteSubscriptionPlan = (plan_id: string) =>
  api.delete(`/api/subscription/admin/delete_plan/${plan_id}`);

export const toggleSubscriptionStatus = (plan_id: string, status: 'active' | 'inactive') =>
  api.post(`/api/subscription/admin/toggle_subscription_status/${plan_id}`, { status });

// ─── Notifications ────────────────────────────────────────────────────────────
export const getAdminNotifications = (notification_type: 'scheduled' | 'sent', page = 1, limit = 10) =>
  api.get('/admin/get-admin-notifications', { params: { notification_type, page, limit } });

export const sendNotification = (data: {
  persona_type: string;
  msg_type: string;
  search: string;
}) => api.post('/admin/send-notification-to-users', data);

export const scheduleNotification = (data: {
  persona_type: string;
  msg_type: string;
  search: string;
  scheduled_time: string;
}) => api.post('/admin/schedule-notification', data);

// ─── Members ─────────────────────────────────────────────────────────────────
export const getMembers = (search?: string, status?: string) =>
  api.get('/api/members', { params: { search, status } });

export const getMemberDetails = (user_id: string, period = '1_month') =>
  api.get(`/api/members/member_details/${user_id}`, { params: { period } });
