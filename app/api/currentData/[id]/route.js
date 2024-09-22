// /api/currentData/[id]/route.js

import connectMongoDB from "../../../lib/db";
import currentData from "../../../models/currentData";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const { id } = params;
  console.log(id);
  const { newlat: lat, newlon: lon } = await request.json();
  await connectMongoDB();
  await currentData.findByIdAndUpdate(id, {
    lat,
    lon,
  });
  return NextResponse.json({ message: "Lat lon are updated" }, { status: 200 });
}

export async function GET(request, { params }) {
  const { id } = params;
  await connectMongoDB();
  const current_data = await currentData.findOne({ _id: id });
  return NextResponse.json({ current_data }, { status: 200 });
}
