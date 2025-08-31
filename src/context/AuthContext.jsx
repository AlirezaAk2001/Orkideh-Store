import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateUser = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setCurrentUser({
        uid,
        email: auth.currentUser.email,
        emailVerified: docSnap.data().emailVerified || false,
        ...docSnap.data(),
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              emailVerified: docSnap.data().emailVerified || false,
              ...docSnap.data(),
            });
          } else {
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              role: "user",
              emailVerified: false,
            });
            await setDoc(docRef, { role: "user", email: user.email, createdAt: new Date(), emailVerified: false }, { merge: true });
          }
        } catch (err) {
          console.error("خطا در گرفتن اطلاعات کاربر:", err);
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            role: "user",
            emailVerified: false,
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};