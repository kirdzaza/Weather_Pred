import connectMongoDB from "../../../lib/db";
import aqiData from "../../../models/aqiData";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const { id } = params;
  console.log(id);
  const { newlat: lat, newlon: lon } = await request.json();
  await connectMongoDB();
  await aqiData.findByIdAndUpdate(id, {
    lat,
    lon,
  });
  return NextResponse.json({ message: "Lat lon are updated" }, { status: 200 });
}

export async function GET(request, { params }) {
  const { id } = params;
  await connectMongoDB();
  const aqi_data = await aqiData.findOne({ _id: id });
  return NextResponse.json({ aqi_data }, { status: 200 });
}
