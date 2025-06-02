import React, { useState } from 'react' 
import styles from '../styles/auth.module.css'
import registerStyles from '../styles/registerform.module.css'
import {useRouter} from 'next/router'
import {FaUser, FaLock} from 'react-icons/fa'

const Register = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("") 
    const router = useRouter()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
           const response = await fetch ("/api/auth/register", {
               method: "POST", 
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ email, password })
           }) 
           const data = await response.json()
           localStorage.setItem("token", data.token)
           router.push("/chat")
        } catch (error) {
            setError(error.message)
        }
    }
    return (
        <div className={styles.authWrapper}>
            <div className={registerStyles.wrapper}>
                <form onSubmit={handleRegister}>
                    <h1>Register</h1>
                    <div className={registerStyles["input-box"]}>
                        <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <FaUser className={registerStyles.icon} />
                    </div>
                    <div className={registerStyles["input-box"]}>
                        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                        <FaLock className={registerStyles.icon} />
                    </div>
                    <button type="submit">Register</button>
                    <div className={registerStyles["login-link"]}>
                        <p>
                            Already have an account? <a href="/">Login Here</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register
