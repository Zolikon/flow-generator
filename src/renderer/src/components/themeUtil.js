export function resolveTheme(theme) {
  switch (theme) {
    case "blue":
      return "bg-blue-500 hover:bg-blue-700 text-stone-100 disabled:bg-gray-300 disabled:text-stone-500";
    case "green":
      return "bg-green-500 hover:bg-green-700 text-stone-100 disabled:bg-gray-300 disabled:text-stone-500";
    case "red":
      return "bg-red-500 hover:bg-red-700 text-stone-100 disabled:bg-gray-300 disabled:text-stone-500";
    case "yellow":
      return "bg-yellow-500 hover:bg-yellow-700 text-stone-700 disabled:bg-gray-300 disabled:text-stone-500";
    default:
      return "bg-blue-500 hover:bg-blue-700 text-stone-100 disabled:bg-gray-300 disabled:text-stone-500";
  }
}
