"use client";
import React from "react";

export default function HomePage() {
  const games = ["Dice", "Roulette", "Slots", "Blackjack", "Poker"];

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-8 text-white">
      <h1 className="text-4xl font-bold mb-8">Casino Games</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div
            key={game}
            className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:scale-105 transition-transform cursor-pointer"
          >
            <h2 className="text-2xl font-semibold text-center">{game}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
