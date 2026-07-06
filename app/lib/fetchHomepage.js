import { serverPost } from "./serverApi";

export async function fetchCarouselSlides() {
  const rows = await serverPost("HomePagesliders/GetData_WebHomePagesliders", { IsActive: "1" });
  if (!Array.isArray(rows)) return [];
  return rows.filter((item) => item?.imagesurl);
}

export async function fetchHomeAstrologers() {
  const rows = await serverPost("Astrologer/GetData_AstrologerHomepage", {});
  if (!Array.isArray(rows)) return [];
  return rows.filter((item) => item?.IsHomePage === true && item?.IsVerified === true);
}

export async function fetchHomeVideo() {
  const rows = await serverPost("CelebritiesVideos/GetData_CelebritiesVideos", {
    bestVideo: "1",
    IsActive: "1",
  });
  return Array.isArray(rows) ? rows : [];
}

export async function fetchHomepageData() {
  const [carouselSlides, homeAstrologers, homeVideo] = await Promise.all([
    fetchCarouselSlides(),
    fetchHomeAstrologers(),
    fetchHomeVideo(),
  ]);

  return { carouselSlides, homeAstrologers, homeVideo };
}
