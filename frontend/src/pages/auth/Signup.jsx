
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  Mail,
  PackageCheck,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import "../../styles/auth.css";

export default function Signup() {
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState("employee");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please complete all required fields.");
      return;
    }

    if (accountType === "vendor" && !organization.trim()) {
      setError("Please enter your company or business name.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    // Frontend demo only: no account is stored or created.
    // Show confirmation, then let the user sign in.
    navigate("/login", {
      state: {
        signupMessage:
          "Demo registration completed successfully. You can now sign in using any valid email and a non-empty password.",
      },
    });
  }

  return (
    <main className="auth-page signup-page">
      <section className="auth-brand-panel">
        <Link to="/login" className="brand-logo">
          <span className="brand-icon">
            <PackageCheck size={25} />
          </span>
          <span>SmartProcure</span>
        </Link>

        <div className="brand-message">
          <span className="eyebrow">GET STARTED</span>
          <h1>
            Better procurement
            <br />
            starts here.
          </h1>
          <p>
            Join a connected workspace designed to make procurement clearer,
            more organized and easier to track.
          </p>

          <div className="brand-feature">
            <span className="feature-icon">
              <UserRound size={21} />
            </span>
            <div>
              <strong>One connected workspace</strong>
              <p>Manage procurement activities in one place.</p>
            </div>
          </div>

          <div className="brand-feature">
            <span className="feature-icon">
              <ShieldCheck size={21} />
            </span>
            <div>
              <strong>Controlled access</strong>
              <p>Additional procurement roles require approval.</p>
            </div>
          </div>
        </div>

        <p className="brand-footer">
          Intelligent procurement. Human-led decisions.
        </p>
      </section>

      <section className="auth-form-panel signup-form-panel">
        <div className="auth-mobile-brand">
          <span className="brand-icon">
            <PackageCheck size={24} />
          </span>
          <span>SmartProcure</span>
        </div>

        <div className="auth-form-container">
          <Link to="/login" className="back-link">
            <ArrowLeft size={16} />
            Back to sign in
          </Link>

          <div className="auth-heading">
            <span className="form-eyebrow">CREATE YOUR ACCOUNT</span>
            <h2>Join SmartProcure</h2>
            <p>Choose your account type to get started.</p>
          </div>

          <div className="account-type-selector">
            <button
              type="button"
              className={`account-type-option ${
                accountType === "employee" ? "selected" : ""
              }`}
              onClick={() => setAccountType("employee")}
              aria-pressed={accountType === "employee"}
            >
              <UserRound size={21} />
              <span>
                <strong>Employee</strong>
                <small>Submit and track requests</small>
              </span>
            </button>

            <button
              type="button"
              className={`account-type-option ${
                accountType === "vendor" ? "selected" : ""
              }`}
              onClick={() => setAccountType("vendor")}
              aria-pressed={accountType === "vendor"}
            >
              <Building2 size={21} />
              <span>
                <strong>Vendor</strong>
                <small>Manage supplier activities</small>
              </span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-field">
              <label htmlFor="signup-name">
                {accountType === "vendor" ? "Contact person" : "Full name"}
              </label>
              <div className="input-wrapper">
                <UserRound size={19} className="input-icon" />
                <input
                  id="signup-name"
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>
            </div>

            {accountType === "vendor" && (
              <div className="form-field">
                <label htmlFor="signup-organization">Company name</label>
                <div className="input-wrapper">
                  <Building2 size={19} className="input-icon" />
                  <input
                    id="signup-organization"
                    type="text"
                    placeholder="Enter your company name"
                    autoComplete="organization"
                    value={organization}
                    onChange={(event) => setOrganization(event.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-field">
              <label htmlFor="signup-email">Email address</label>
              <div className="input-wrapper">
                <Mail size={19} className="input-icon" />
                <input
                  id="signup-email"
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="signup-password">Password</label>
              <div className="input-wrapper">
                <ShieldCheck size={19} className="input-icon" />
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  minLength={8}
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

            {error && (
              <div className="auth-message" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="primary-auth-button">
              Create account
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>

          <p className="auth-security-note">
            <ShieldCheck size={16} />
            Officer and Manager roles require authorized approval
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
