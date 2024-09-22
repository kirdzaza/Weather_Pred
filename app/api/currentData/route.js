// /api/currentData/route.js

import connectMongoDB from "../../lib/db";
import currentData from "../../models/currentData";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { lat, lon } = await request.json();

  await connectMongoDB();
  await currentData.create({ lat, lon });
  return NextResponse.json({ message: "Lat lon are created" }, { status: 201 });
}

export async function GET() {
  await connectMongoDB();

  const current_data = await currentData.find();
  return NextResponse.json({ current_data });
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDB();
  await currentData.findByIdAndDelete(id);
  return NextResponse.json({ message: "Lat Lon are deleted" }, { status: 200 });
}
