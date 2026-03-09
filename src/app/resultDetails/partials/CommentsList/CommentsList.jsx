"use client";
import { useEffect } from "react";
import { useApiManager } from "@/hooks/useApiManager";
import { useRouter } from "next/navigation";
import { useComment } from "@/context/commentContext";
import styles from "./styles.module.css";

export default function CommentsList({ auctionId }) {
    const { get, del  } = useApiManager();
    const router = useRouter();
    const {comments, setComments, deleteComment } = useComment();

    useEffect(() => {
        const loadComments = async () => {
          try {
            const data = await get(`api/subastas/${auctionId}/comment/`);
            // asumiendo que la API devuelve un array plano
            setComments(Array.isArray(data) ? data : data.results || []);
          } catch (err) {
            console.error("Error al cargar comentarios:", err);
          }
        };
        loadComments();
    }, [auctionId, get, setComments]);

    const handleUpdateComment = (commentId) => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            alert("Debes iniciar sesión para modificar un comentario.");
            router.push("/login");
            return;
        }
        router.push(`/createComment?auctionId=${auctionId}&commentId=${commentId}`)
    }

    const handleDeleteComment = async (commentId) => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("Debes iniciar sesión para eliminar un comentario.");
            router.push("/login");
            return;
        }
        if (!confirm("¿Seguro que deseas borrar este comentario?")) return;
        try {
        await del(`api/subastas/${auctionId}/comment/${commentId}/`)
        deleteComment(commentId); // Eliminar del contexto local
        alert("Comentario eliminado.");
        } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema al eliminar el comentario");
        }
    };

    return (
        <div className={styles.BidList}>
        {comments.length > 0 ? (
            comments.map((comment, index) => (
                <div key={comment.id && auctionId? comment.id : `comment-${index}`} className={styles.bidItem}>
                    <div className={styles.bidDetails}>
                        <h3>{comment.title}</h3>
                        <p>{comment.text}</p>
                        <small>
                        Creado: {new Date(comment.created_at).toLocaleString()}
                        {comment.updated_at && ` — Editado: ${new Date(comment.updated_at).toLocaleString()}`}
                        </small>
                    </div>
                    <div className={styles.bidActions}>
                        <button onClick={() => handleDeleteComment(comment.id)} className={styles.button}> Delete Comment </button>
                        <button onClick={() => handleUpdateComment(comment.id)} className={styles.button}> Update Comment </button>
                    </div>
                </div>
        ))
            ) : (
        <p>No Comments created.</p>
        )}
        </div>
    );
}
