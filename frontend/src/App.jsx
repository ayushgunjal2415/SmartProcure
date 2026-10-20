
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/Signup.jsx";
import Quotations from "./pages/Quotations.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import DashboardPreview from "./pages/DashboardPreview.jsx";
import Requests from "./pages/Requests.jsx";
import CreateRequest from "./pages/CreateRequest.jsx";
import RequestDetails from "./pages/RequestDetails.jsx";
import RequestTracking from "./pages/RequestTracking.jsx";
import Vendors from "./pages/Vendors.jsx";
import VendorRegistrations from "./pages/VendorRegistrations.jsx";
import RFQs from "./pages/RFQs.jsx";
import CreateRFQ from "./pages/CreateRFQ.jsx";
import OrderTracking from "./pages/OrderTracking.jsx";
import Evaluations from "./pages/Evaluations.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication pages */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Shared procurement workspace */}
        <Route element={<DashboardLayout />}>

          <Route path="/quotations" element={<Quotations />} />
          <Route path="/rfqs" element={<RFQs />} />
          <Route path="/rfqs/new" element={<CreateRFQ />} />
          <Route path="/evaluations" element={<Evaluations />} />

          <Route
          path="/vendor-registrations"
          element={<VendorRegistrations />}
/>

          <Route path="/vendors" element={<Vendors />} />

          <Route
            path="/tracking"
            element={<OrderTracking />}
/>

          <Route
           path="/request-tracking"
           element={<RequestTracking />}
/>
          <Route
            path="/requests/:requestId"
            element={<RequestDetails />}
/>
          <Route
            path="/dashboard"
            element={<DashboardPreview />}
          />

          <Route
            path="/requests"
            element={<Requests />}
          />

          <Route
            path="/requests/new"
            element={<CreateRequest />}
          />
        </Route>

        {/* Unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
