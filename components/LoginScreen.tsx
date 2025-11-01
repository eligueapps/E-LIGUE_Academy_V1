import React, { useState, useEffect } from 'react';

// --- Styles injected for the new login screen design ---
const loginStyles = `
  body.login-page-bg {
    background: linear-gradient(135deg, #000000, #3533cd);
    overflow: hidden;
  }

  @keyframes moveBg {
    from { transform: translateY(0); }
    to { transform: translateY(-100px); }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .login-background-text {
    position: absolute;
    inset: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    text-transform: uppercase;
    font-weight: 800;
    font-size: 8rem;
    letter-spacing: 0.1em;
    opacity: 0.05;
    color: #ffffff;
    text-align: center;
    line-height: 1.2;
    user-select: none;
    pointer-events: none;
    animation: moveBg 40s linear infinite alternate;
  }
  @media (max-width: 480px) {
    .login-background-text {
      font-size: 4rem;
    }
  }

  .login-container {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    animation: fadeIn 1.2s ease;
  }

  .login-button {
    background: linear-gradient(90deg, #cccccc, #ffffff);
    color: #3533cd;
    transition: all 0.3s;
  }
  
  .login-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(255, 255, 255, 0.3);
  }

  .login-logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    margin-bottom: 30px;
    font-family: "Century Gothic", "ITC Century Gothic", Arial, sans-serif;
    --logo-white-1: #ffffff;
    --logo-white-2: #cccccc;
  }
  .login-logo .brand {
    display: flex;
    align-items: center;
    position: relative;
    justify-content: center;
  }
  .login-logo .e-part, .login-logo .ligue {
    font-weight: 800;
    font-size: 40px;
    background: linear-gradient(90deg, var(--logo-white-1), var(--logo-white-2));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .login-logo .e-part {
    margin-right: 5px;
  }
  .login-logo .mortar {
    position: absolute;
    left: 50%;
    transform: translateX(-68%) translateY(-15px) rotate(-5deg);
    width: 45px;
    height: 30px;
  }
  .login-logo .academy {
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    background: linear-gradient(90deg, var(--logo-white-1), var(--logo-white-2));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-top: 4px;
  }
`;

// This logo is specific to the login screen's white-on-dark design
const LoginLogo: React.FC = () => {
    const gradientId = "grad-white-logo";
    return (
        <div className="login-logo" role="img" aria-label="Logo E-LIGUE Academy">
            <div className="brand">
                <div className="e-part">E-</div>
                <svg className="mortar" viewBox="0 0 64 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <defs>
                        <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
                            <stop offset="0%" stopColor="#ffffff"/>
                            <stop offset="100%" stopColor="#cccccc"/>
                        </linearGradient>
                    </defs>
                    <g>
                      <polygon points="32,2 4,12 32,22 60,12" fill={`url(#${gradientId})`}/>
                      <rect x="20" y="20" width="24" height="6" rx="1" fill="#ffffff"/>
                      <path d="M44 10 C46 12,46 16,42 18" stroke="#cccccc" strokeWidth="2" fill="none"/>
                      <circle cx="42" cy="18" r="2" fill="#cccccc"/>
                    </g>
                </svg>
                <div className="ligue">LIGUE</div>
            </div>
            <div className="academy">ACADEMY</div>
        </div>
    );
};


interface LoginScreenProps {
  onLogin: (email: string, pass: string) => void;
  error: string | null;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  useEffect(() => {
    // Inject styles dynamically
    const styleElement = document.createElement('style');
    styleElement.innerHTML = loginStyles;
    document.head.appendChild(styleElement);
    
    // Add class to body
    document.body.classList.add('login-page-bg');

    // Cleanup on component unmount
    return () => {
      document.head.removeChild(styleElement);
      document.body.classList.remove('login-page-bg');
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-center font-['Century_Gothic',_'ITC_Century_Gothic',_Arial,_sans-serif]">
      <div className="login-background-text" aria-hidden="true">
        ARBITRES • ENTRAÎNEURS • FORMATEURS • COMPÉTENCE • TECHNIQUE • ESPRIT D’ÉQUIPE • DÉVELOPPEMENT • PERFORMANCE
      </div>

      <div className="w-full max-w-sm p-10 login-container rounded-2xl shadow-2xl relative z-10 text-white">
        <div className="flex justify-center">
            <LoginLogo />
        </div>

        <h2 className="text-white text-lg mb-6 tracking-wider">Connexion à votre espace</h2>
        
        <form onSubmit={handleSubmit}>
          <input
            id="email-address"
            name="email"
            type="text"
            autoComplete="email"
            required
            className="w-full py-3 px-4 mb-4 border-none rounded-lg bg-white/20 text-white text-sm outline-none placeholder:text-white/70"
            placeholder="Identifiant ou e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full py-3 px-4 mb-4 border-none rounded-lg bg-white/20 text-white text-sm outline-none placeholder:text-white/70"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-300 text-sm text-center mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 login-button rounded-lg font-bold tracking-wider cursor-pointer"
          >
            Se connecter
          </button>
        </form>

        <div className="mt-4 text-xs text-white/80">
          <p>E-LIGUE Academy — Support : <a href="mailto:academy@e-ligue.ma" className="text-white font-bold no-underline hover:underline">academy@e-ligue.ma</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
