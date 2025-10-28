"use client"

import { useState } from "react"
import axios from "axios"
import API_BASE_URL from "../config"

function CompteForm({ onAccountCreated }) {
    const [compte, setCompte] = useState({ solde: "", dateCreation: "", type: "" })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setCompte({ ...compte, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        console.log(compte)
        axios
            .post(`${API_BASE_URL}/comptes`, compte)
            .then((response) => {
                alert("✅ Votre compte a été créé avec succès ! 🎉")
                setCompte({ solde: "", dateCreation: "", type: "" })
                setLoading(false)
                if (onAccountCreated) {
                    onAccountCreated(response.data)
                }
            })
            .catch((error) => {
                console.error(error)
                alert("⚠️ Une erreur est survenue lors de la création du compte. Veuillez réessayer.")
                setLoading(false)
            })
    }

    return (
        <div className="card shadow-lg border-0 h-100" style={{ borderRadius: "12px" }}>
            <div
                className="card-header text-center text-white"
                style={{
                    background: "linear-gradient(135deg, #00b4db 0%, #0083b0 100%)",
                    borderTopLeftRadius: "12px",
                    borderTopRightRadius: "12px"
                }}
            >
                <h5 className="card-title mb-0">
                    <i className="bi bi-plus-circle me-2"></i>Ajouter un Compte
                </h5>
            </div>

            <div className="card-body p-4" style={{ backgroundColor: "#f9fbfd" }}>
                <form onSubmit={handleSubmit}>
                    {/* Champ solde */}
                    <div className="mb-4">
                        <label className="form-label fw-semibold text-dark">Solde (€)</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-0">€</span>
                            <input
                                type="number"
                                name="solde"
                                className="form-control border rounded-3 bg-white shadow-sm"
                                placeholder="0.00"
                                onChange={handleChange}
                                value={compte.solde}
                                required
                            />
                        </div>
                    </div>

                    {/* Champ date */}
                    <div className="mb-4">
                        <label className="form-label fw-semibold text-dark">Date de Création</label>
                        <input
                            type="date"
                            name="dateCreation"
                            className="form-control border rounded-3 bg-white shadow-sm"
                            onChange={handleChange}
                            value={compte.dateCreation}
                            required
                        />
                    </div>

                    {/* Champ type */}
                    <div className="mb-4">
                        <label className="form-label fw-semibold text-dark">Type de Compte</label>
                        <select
                            name="type"
                            className="form-select border rounded-3 bg-white shadow-sm"
                            onChange={handleChange}
                            value={compte.type}
                            required
                        >
                            <option value="">Sélectionner un type...</option>
                            <option value="COURANT">COURANT</option>
                            <option value="EPARGNE">EPARGNE</option>
                        </select>
                    </div>

                    {/* Bouton d’envoi */}
                    <button
                        type="submit"
                        className="btn w-100 fw-semibold py-2 text-white"
                        disabled={loading}
                        style={{
                            background: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)",
                            border: "none",
                            borderRadius: "8px",
                            boxShadow: "0 4px 10px rgba(0, 114, 255, 0.3)"
                        }}
                    >
                        {loading ? (
                            <>
                <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                ></span>
                                Ajout en cours...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check-circle me-2"></i>Ajouter le Compte
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CompteForm
