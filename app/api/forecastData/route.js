import connectMongoDB from "../../lib/db";
import forecastData from "../../models/forecastData";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { lat, lon } = await request.json();

  await connectMongoDB();
  await forecastData.create({ lat, lon });
  return NextResponse.json({ message: "Lat Lon are created" }, { status: 201 });
}

export async function GET() {
  await connectMongoDB();
  const forecast_data = await forecastData.find();
  return NextResponse.json({ forecast_data });
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDB();
  await forecastData.findByIdAndDelete(id);
  return NextResponse.json({ message: "Lat Lon are deleted" }, { status: 200 });
}
