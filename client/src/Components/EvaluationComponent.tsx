import React from "react";
import { Categories } from "../data/Category";
import { Evaluation } from "../data/UserInfo";

interface EvaluationComponentProps {
  evaluation: Evaluation;
  categories: Categories;
}

export default function EvaluationComponent(props: EvaluationComponentProps) {
  const { evaluation, categories } = props;
  return (
    <div>
      <>
        <h4>Favorite Categories</h4>
        <ul>
          {evaluation.favoriteCategories.map((ev) => {
            return (
              <li key={`favorite-${ev[0]}`}>
                {categories.get(ev[0]) ?? "?"}: {ev[1]}
              </li>
            );
          })}
        </ul>
        <h4>Least Liked Categories</h4>
        <ul>
          {evaluation.leastLikedCategories.map((ev) => {
            return (
              <li key={`least-liked-${ev[0]}`}>
                {categories.get(ev[0]) ?? "?"}: {ev[1]}
              </li>
            );
          })}
        </ul>
      </>
    </div>
  );
}
