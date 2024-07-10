import {collection, onSnapshot, orderBy, query} from "firebase/firestore";
import {db} from "../../firebase/firebase-init";

// 공지 데이터 목록 불러오기
export const fetchAnnouncements = (setAnnouncements) => {
    // 공지 데이터 날짜 내림차순 정렬
    const dataQuery = query(collection(db, "announcements"), orderBy("timestamp", "desc"));
    const handleSnapshot = (querySnapshot) => {
        const newAnnouncements = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                readBy: data.readBy ? Object.keys(data.readBy).filter(userId => data.readBy[userId]) : []
            };
        });
        setAnnouncements(newAnnouncements);
    };
    // onSnapshot : 쿼리에 대한 실시간 데이터 구독(비동기 방식)
    return onSnapshot(dataQuery, handleSnapshot);
};