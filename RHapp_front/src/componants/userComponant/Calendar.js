import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getAllDemandes,getUserById} from "../../apiService/getElementApi";

function parseJwt(token) {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
        const jsonPayload = decodeURIComponent(
            atob(padded)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("parseJwt error:", e);
        return {};
    }
}

function extractRole(payload) {
    let role =
        payload.role ||
        (Array.isArray(payload.roles) && payload.roles[0]) ||
        (Array.isArray(payload.authorities) && payload.authorities[0]) ||
        payload.scope;
    if (Array.isArray(role)) role = role[0];
    if (typeof role === "string" && role.startsWith("ROLE_")) {
        role = role.replace("ROLE_", "");
    }
    return role;
}

function extractUserId(payload) {
    return (
        payload.id ??
        payload.userId ??
        payload.uid ??
        (payload.sub && !isNaN(Number(payload.sub)) ? Number(payload.sub) : undefined)
    );
}

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [role, setRole] = useState("");
    const [userId, setUserId] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) return;
        const payload = parseJwt(token);
        const r = extractRole(payload);
        const id = extractUserId(payload);
        setRole(r || "");
        if (id) {
            setUserId(id);
            localStorage.setItem("userId", String(id));
        }
    }, [token]);

    useEffect(() => {
        const fetchDemandes = async () => {
            try {
                if (role !== "ADMIN") return;

                const demandes = await getAllDemandes();
                if (!Array.isArray(demandes)) return;

                const demandesWithUser = await Promise.all(
                    demandes.map(async (d) => {
                        try {
                            const u = await getUserById(d.idUser);
                            return {
                                ...d,
                                employe: `${u.nom} ${u.prenom}`,
                            };
                        } catch (err) {
                            console.error("Erreur getUserById:", err);
                            return { ...d, employe: "Employé inconnu" };
                        }
                    })
                );
                console.log(demandes);


                const formattedEvents = demandesWithUser.map((d) => {
                    let bgColor = "orange";
                    if (d.statut === "ACCEPTE") bgColor = "green";
                    if (d.statut === "REFUSE") bgColor = "red";

                    return {
                        id: d.id,
                        title: `${d.employe} - ${d.type} (${d.statut})`,
                        start: d.dateDebut,
                        end: d.dateFin,
                        backgroundColor: bgColor,
                        borderColor: bgColor,
                    };
                });

                setEvents(formattedEvents);
            } catch (error) {
                console.error("Erreur fetch demandes:", error);
            }
        };

        if ((role === "ADMIN") && userId) {
            fetchDemandes();
        }
    }, [role, userId]);

    return (
        <div style={{ padding: "20px" }}>
            <h2>Calendrier des demandes</h2>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                events={events}
            />
        </div>
    );
};

export default Calendar;
