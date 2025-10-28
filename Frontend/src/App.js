"use client"

import CompteList from "./components/CompteList"
import CompteForm from "./components/CompteForm"
import { useState, useCallback } from "react"

function App() {
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const [newAccount, setNewAccount] = useState(null)

    const handleAccountCreated = useCallback((account) => {
        setNewAccount(account)
    }, [])

    return (
        <div
            className="min-vh-100 d-flex flex-column"
            style={{
                background: "linear-gradient(135deg, #f9fbfd 0%, #e0ecf8 100%)",
                fontFamily: "'Poppins', 'Segoe UI', Arial, sans-serif",
            }}
        >
            {/* Navbar modernisée */}
            <nav
                className="navbar shadow-sm py-3"
                style={{
                    background: "linear-gradient(135deg, #00b4db 0%, #0083b0 100%)",
                    color: "white",
                }}
            >
                <div className="container-fluid d-flex justify-content-center">
          <span className="navbar-brand mb-0 h1 fw-semibold text-white">
            <i className="bi bi-bank2 me-2"></i>Gestion des Comptes Bancaires
          </span>
                </div>
            </nav>

            {/* Contenu principal */}
            <div className="container py-5 flex-grow-1">
                <div className="row justify-content-center g-4">
                    <div className="col-lg-5 col-md-8">
                        <CompteForm onAccountCreated={handleAccountCreated} />
                    </div>
                    <div className="col-lg-7 col-md-10">
                        <CompteList refreshTrigger={refreshTrigger} newAccount={newAccount} />
                    </div>
                </div>
            </div>

            {/* Pied de page */}
            <footer
                className="text-center py-4 mt-auto shadow-sm"
                style={{
                    background: "linear-gradient(135deg, #0083b0 0%, #00b4db 100%)",
                    color: "white",
                    fontSize: "0.95rem",
                    letterSpacing: "0.3px",
                }}
            >
                <p className="mb-0">
                    © 2025 <strong>Bank Account Management System</strong> — Tous droits réservés.
                </p>
            </footer>
        </div>
    )
}

export default App
