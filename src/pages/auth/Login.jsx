
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";
import { useDemoAuth } from "../../context/DemoAuthContext.jsx";
import "../../styles/auth.css";

export default function Login() {
  const navigate = useNavigate();

  const location = useLocation();
  const signupMessage = location.state?.signupMessage;

  const { switchRole } = useDemoAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      setError("Please enter your email address and password.");
      return;
    }

    // Frontend demo only: no credentials are sent to a server.
    // Start each new demo login with the Employee role.
    switchRole("Employee");
    navigate("/dashboard");
  }

  return (
    <main className="auth-page">
      <section className="auth-brand-panel">
        <Link to="/login" className="brand-logo">
          <span className="brand-icon">
            <PackageCheck size={25} />
          </span>
          <span>SmartProcure</span>
        </Link>

        <div className="brand-message">
          <span className="eyebrow">INTELLIGENT PROCUREMENT</span>
          <h1>
            Smarter decisions.
            <br />
            Better procurement.
          </h1>
          <p>
            Bring requests, vendor evaluation, approvals and purchase orders
            together in one intelligent workspace.
          </p>

          <div className="brand-feature">
            <span className="feature-icon">
              <ShieldCheck size={21} />
            </span>
            <div>
              <strong>Transparent decisions</strong>
              <p>Understand recommendations before approving.</p>
            </div>
          </div>

          <div className="brand-feature">
            <span className="feature-icon">
              <PackageCheck size={21} />
            </span>
            <div>
              <strong>One connected workflow</strong>
              <p>Track procurement from request to delivery.</p>
            </div>
          </div>
        </div>

        <p className="brand-footer">
          Intelligent procurement. Human-led decisions.
        </p>
      </section>

      <section className="auth-form-panel">
        <div className="auth-mobile-brand">
          <span className="brand-icon">
            <PackageCheck size={24} />
          </span>
          <span>SmartProcure</span>
        </div>

        <div className="auth-form-container">
          <div className="auth-heading">
            <span className="form-eyebrow">WELCOME BACK</span>
            <h2>Sign in to your account</h2>
            <p>Enter your credentials to access your workspace.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-field">
              <label htmlFor="login-email">Email address</label>
              <div className="input-wrapper">
                <Mail size={19} className="input-icon" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="username"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <div className="label-row">
                <label htmlFor="login-password">Password</label>
                <span className="helper-text">Enter your password</span>
              </div>

              <div className="input-wrapper">
                <LockKeyhole size={19} className="input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {signupMessage && (
              <div className="auth-message success-message" role="status">
                {signupMessage}
              </div>
            )}

            {error && (
              <div className="auth-message" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="primary-auth-button">
              Sign in
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-divider">
            <span>NEW TO SMARTPROCURE?</span>
          </div>

          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Create an account</Link>
          </p>

          <p className="auth-security-note">
            <ShieldCheck size={16} />
            Your procurement workspace, all in one place
          </p>
        </div>

        <footer className="auth-legal">
          <span>© {new Date().getFullYear()} SmartProcure</span>
          <span>Procurement Management Platform</span>
        </footer>
      </section>
    </main>
  );
}
