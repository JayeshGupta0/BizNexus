import { createBrowserRouter } from 'react-router';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LeadsPipeline from './pages/LeadsPipeline';
import LeadDetail from './pages/LeadDetail';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import SalesOrders from './pages/SalesOrders';
import Quotations from './pages/Quotations';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Purchases from './pages/Purchases';
import Suppliers from './pages/Suppliers';
import Finance from './pages/Finance';
import Invoices from './pages/Invoices';
import Payments from './pages/Payments';
import Expenses from './pages/Expenses';
import SocialContent from './pages/SocialContent';
import Campaigns from './pages/Campaigns';
import Analytics from './pages/Analytics';
import Documents from './pages/Documents';
import AIAssistant from './pages/AIAssistant';
import UsersRoles from './pages/UsersRoles';
import Settings from './pages/Settings';
import AccessDenied from './pages/AccessDenied';
import NotFound from './pages/NotFound';
import Landing from './pages/Landing';

export const router = createBrowserRouter([
  { path: '/', Component: Landing },
  { path: '/login', Component: Login },
  { path: '/register', Component: Register },
  {
    Component: AppLayout,
    children: [
      { path: 'dashboard', Component: Dashboard },
      { path: 'crm/leads', Component: LeadsPipeline },
      { path: 'crm/leads/:id', Component: LeadDetail },
      { path: 'crm/customers', Component: Customers },
      { path: 'crm/customers/:id', Component: CustomerDetail },
      { path: 'sales/orders', Component: SalesOrders },
      { path: 'sales/quotations', Component: Quotations },
      { path: 'crm/quotations', Component: Quotations },
      { path: 'quotations', Component: Quotations },
      { path: 'inventory/products', Component: Inventory },
      { path: 'inventory', Component: Inventory },
      { path: 'purchases', Component: Purchases },
      { path: 'suppliers', Component: Suppliers },
      { path: 'finance', Component: Finance },
      { path: 'finance/invoices', Component: Invoices },
      { path: 'finance/payments', Component: Payments },
      { path: 'finance/expenses', Component: Expenses },
      { path: 'marketing/social', Component: SocialContent },
      { path: 'marketing/campaigns', Component: Campaigns },
      { path: 'analytics', Component: Analytics },
      { path: 'documents', Component: Documents },
      { path: 'ai-assistant', Component: AIAssistant },
      { path: 'settings/users', Component: UsersRoles },
      { path: 'settings', Component: Settings },
      { path: 'access-denied', Component: AccessDenied },
      { path: '*', Component: NotFound },
    ],
  },
]);
