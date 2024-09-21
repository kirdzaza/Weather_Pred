import connectMongoDB from "../../lib/db";
import aqiData from "../../models/aqiData";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { lat, lon } = await request.json();

  await connectMongoDB();
  await aqiData.create({ lat, lon });
  return NextResponse.json({ message: "Lat Lon are created" }, { status: 201 });
}

export async function GET() {
  await connectMongoDB();
  const aqi_data = await aqiData.find();
  return NextResponse.json({ aqi_data });
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDB();
  await aqiData.findByIdAndDelete(id);
  return NextResponse.json({ message: "Lat Lon are deleted" }, { status: 200 });
}
