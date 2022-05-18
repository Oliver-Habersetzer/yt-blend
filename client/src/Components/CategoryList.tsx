import React from "react";
import { Categories } from "../data/Category";

interface CategoryListProps {
  categories: Categories;
}

export default function VideoList(props: CategoryListProps) {
  return (
    <div className="d-inline-flex flex-wrap overflow-y-scroll">
      {[...props.categories.entries()].map((category) => (
        <div
          key={`${category[1]}-${category[0]}`}
          className="m-1 p-1 shadow shadow-sm border border-white flex-grow"
        >
          {category[0]}: {category[1]}
        </div>
      ))}
    </div>
  );
}
