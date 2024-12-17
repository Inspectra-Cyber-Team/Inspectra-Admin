"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { RecentProps } from "@/types/overviewPieType"


const COLORS = ["#DCFFB3", "#F9B800", "#b9ff66", "#60935D"]

export function Recent({ data }: Readonly<RecentProps>) {

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={80}
         
          paddingAngle={0}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

