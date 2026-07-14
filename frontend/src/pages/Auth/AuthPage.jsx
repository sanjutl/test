import { useState } from "react";
import styles from "./AuthPage.module.css";
import axios from "axios";
import baseUrl from "../../baseUrl";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const AuthPage = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(true);
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });
  const handleSignInChange = (e) => {
    const { name, value } = e.target;

    setSignInData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSignUpChange = (e) => {
    const { name, value } = e.target;

    setSignUpData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${baseUrl}/api/auth/signUp`, signUpData);

      if (res.status === 201) {
        localStorage.setItem("token", res.data.token);
        toast.success(res.data.message);
        setIsSignUp(false);
        setSignUpData({
          name: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  const handleSignIn = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      `${baseUrl}/api/auth/signIn`,
      signInData
    );

    if (res.status === 200) {
      localStorage.setItem("token", res.data.token);
      setSignInData({
        email: "",
        password: "",
      });

      navigate("/home");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Something went wrong"
    );
  }
};
  return (
    <main className={styles.authPage}>
      <div
        className={`${styles.authContainer} ${
          isSignUp ? styles.signUpMode : styles.signInMode
        }`}
      >
        <section className={styles.signInContainer}>
          <h1>Sign Into your Account</h1>

          <form className={styles.form} onSubmit={handleSignIn}>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={signInData.email}
              onChange={handleSignInChange}
            />

            <input
              type="password"
              placeholder="Password"
              name="password"
              value={signInData.password}
              onChange={handleSignInChange}
            />

            <button type="button" className={styles.forgotButton}>
              Forgot your password?
            </button>

            <button type="submit" className={styles.primaryButton}>
              SIGN IN
            </button>
          </form>
        </section>

        <section className={styles.signUpContainer}>
          <h1>Create Account</h1>

          <form className={styles.form} onSubmit={handleSignUp}>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={signUpData.name}
              onChange={handleSignUpChange}
            />

            <input
              type="email"
              placeholder="Email"
              name="email"
              value={signUpData.email}
              onChange={handleSignUpChange}
            />

            <input
              type="password"
              placeholder="Password"
              name="password"
              value={signUpData.password}
              onChange={handleSignUpChange}
            />

            <button type="submit" className={styles.primaryButton}>
              SIGN UP
            </button>
          </form>
        </section>

        <section className={styles.overlayContainer}>
          <div className={styles.overlay}>
            <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
              <h1>Welcome Back!</h1>

              <p>
                To keep connected with us please login with your personal info
              </p>

              <button
                type="button"
                className={styles.outlineButton}
                onClick={() => setIsSignUp(false)}
              >
                SIGN IN
              </button>
            </div>

            <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
              <h1>Hello Friend!</h1>

              <p>Enter your personal details and start journey with us</p>

              <button
                type="button"
                className={styles.outlineButton}
                onClick={() => setIsSignUp(true)}
              >
                SIGN UP
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AuthPage;
