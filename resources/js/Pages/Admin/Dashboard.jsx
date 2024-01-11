import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import axios from "axios";

export default function Dashboard({ auth, revenue }) {
    const [showGreeting, setShowGreeting] = useState(true);
    const [userMusicInfo, setUserMusicInfo] = useState([]);
    const [totalSongs, setTotalSongs] = useState(0);
    const [totalView, setTotalView] = useState(0);
    const [totalAlbums, setTotalAlbums] = useState(0);
    const [userName, setUserName] = useState(auth.user.name);
    const [topUsers, setTopUsers] = useState([]);
    const [successfulTransactions, setSuccessfulTransactions] = useState([]);

    useEffect(() => {
        axios
            .get("/user-music-info")
            .then((response) => {
                setUserMusicInfo(response.data.userMusicInfo);
                setTotalSongs(response.data.totalSongs);
                setTotalAlbums(response.data.totalAlbums);
            })
            .catch((error) => {});

        axios
            .get("/get-total-view")
            .then((response) => {
                setTotalView(response.data.totalView);
            })
            .catch((error) => {});

        axios
            .get("/dashboard-data")
            .then((response) => {
                setTopUsers(response.data.topUsers);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

        axios
            .get("/get-stripe-transactions")
            .then((response) => {
                const transactions = response.data.transactions;
                setSuccessfulTransactions(transactions);
            })
            .catch((error) => {
                console.error("Error fetching Stripe transactions:", error);
            });
    }, []);

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="py-5">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-4 text-base">
                    <div className="bg-cyan-400 overflow-hidden shadow-sm sm:rounded-lg">
                        {auth.user.id_role === 2 ? (
                            <>
                                <div className="p-6 text-gray-900">
                                    Bạn không có quyền truy cập.
                                </div>
                            </>
                        ) : (
                            <>
                                {showGreeting && (
                                    <div className="p-5 text-gray-900">
                                        Xin chào,
                                        <span className="text-white">
                                            {auth.user.id_role === 1
                                                ? " Admin "
                                                : auth.user.id_role === 3
                                                ? " Artist "
                                                : ""}
                                            {userName}!
                                        </span>
                                        Bạn đã đăng nhập.
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
                {auth.user.id_role === 1 && (
                    <div className="text-white pt-2 py-5 mx-auto sm:px-6 lg:px-4">
                        <h2>Payment</h2>
                        <div>
                            <h3>All Transactions:</h3>
                            <ul>
                                {Array.isArray(successfulTransactions) &&
                                    successfulTransactions.map(
                                        (transaction) => (
                                            <li key={transaction.id}>
                                                Amount:{" "}
                                                {transaction.amount.toLocaleString()}{" "}
                                                {transaction.currency}
                                            </li>
                                        )
                                    )}
                            </ul>
                        </div>

                        <h2 className="block text-xl">Top nghệ sĩ</h2>
                        <div className="flex gap-10">
                            {topUsers && topUsers.length > 0 ? (
                                <div className="flex gap-10 mt-4">
                                    {topUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className="bg-gray-800 p-4 rounded-md mb-4 w-52"
                                        >
                                            <h2 className="text-base font-semibold mb-2">
                                                <a href={`/artist/${user.id}`}>
                                                    {user.name}
                                                </a>
                                            </h2>
                                            <p className="text-sm">
                                                Tổng view:{" "}
                                                {user.total_view.toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>Không có nghệ sĩ nào.</p>
                            )}
                        </div>
                    </div>
                )}

                {auth.user.id_role === 3 && (
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-4">
                        {userMusicInfo && userMusicInfo.length > 0 ? (
                            <div className="text-white">
                                <h2 className="block font-semibold text-2xl text-white mt-4">
                                    Thống kê Artist: {userName}
                                </h2>
                                <div className="flex gap-10 mt-4">
                                    <div className="bg-gray-800 p-2 rounded-md mb-4 flex-1">
                                        <h2 className="text-base font-semibold mb-2">
                                            Tổng số Views
                                        </h2>
                                        <p className="text-sm">
                                            {totalView.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="bg-blue-800 p-2 rounded-md mb-4 flex-1">
                                        <h2 className="text-base font-semibold mb-2">
                                            Tổng số bài hát
                                        </h2>
                                        <p className="text-sm">{totalSongs}</p>
                                    </div>
                                    <div className="bg-green-800 p-2 rounded-md mb-4 flex-1">
                                        <h2 className="text-base font-semibold mb-2">
                                            Tổng số Albums
                                        </h2>
                                        <p className="text-sm">{totalAlbums}</p>
                                    </div>
                                    <div className="bg-red-800 p-2 rounded-md mb-4 flex-1">
                                        <h2 className="text-base font-semibold mb-2">
                                            Số tiền bạn nhận được
                                        </h2>
                                        <p className="text-sm">0đ</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                                    {userMusicInfo.map((music) => (
                                        <div
                                            key={music.id}
                                            className="max-w-sm mt-4 rounded overflow-hidden shadow-lg bg-gray-800"
                                        >
                                            <div className="flex justify-center">
                                                <img
                                                    className="object-cover h-36 w-36 rounded mt-4"
                                                    src={`../upload/images/${music.thumbnail}`}
                                                    alt={music.name}
                                                />
                                            </div>
                                            <div className="px-6 py-4 flex flex-col items-center justify-center">
                                                <div className="font-bold text-base mb-2 text-white">
                                                    {music.name}
                                                </div>
                                                <p className="text-sm text-white">
                                                    Views: {music.view}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p>Không có thông tin âm nhạc nào.</p>
                        )}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
