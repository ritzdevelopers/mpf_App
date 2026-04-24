// components/Header/headerUI.ts
export const styles = {
  container: "bg-white",

  /* Same as before the redesign: fixed hero height, image fills box */
  banner: "w-full h-80 relative overflow-hidden",

  /* Text + gradient only at the bottom of the photo (not full-screen tint) */
  overlay:
    "absolute bottom-0 left-0 right-0 px-4 pb-2 pt-8 bg-gradient-to-t from-black/50 to-transparent",
  heading: "text-white text-xl font-bold",
  subHeading: "text-white text-xs font-medium mt-0.5",
};
