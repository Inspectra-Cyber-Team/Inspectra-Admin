"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { name: "Jan", total: 150 },
  { name: "Feb", total: 200 },
  { name: "Mar", total: 180 },
  { name: "Apr", total: 170 },
  { name: "May", total: 160 },
  { name: "Jun", total: 190 },
  { name: "Jul", total: 180 },
  { name: "Aug", total: 170 },
  { name: "Sep", total: 160 },
  { name: "Oct", total: 170 },
  { name: "Nov", total: 180 },
  { name: "Dec", total: 190 },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

