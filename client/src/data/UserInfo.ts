import { Categories } from "./Category";
import Channel from "./Channel";
import Video from "./Video";

export interface Evaluation {
  favoriteCategories: [number, number][];
  leastLikedCategories: [number, number][];
}

function orderMapByValue(
  map: Map<number, number>,
  asc: boolean
): [number, number][] {
  return [...map.entries()].sort((a, b) => {
    if (asc) return a[1] - b[1];
    else return b[1] - a[1];
  });
}

export default class UserInfo {
  subscriptions?: Channel[];
  likedVideos?: Video[];
  dislikedVideos?: Video[];
  categories?: Categories;
  evaluation?: Evaluation;

  public setSubscriptions(subscriptions: Channel[]) {
    this.subscriptions = subscriptions;
    return this;
  }

  public setLikedVideos(likedVideos: Video[]) {
    this.likedVideos = likedVideos;
    return this;
  }

  public setDislikedVideos(dislikedVideos: Video[]) {
    this.dislikedVideos = dislikedVideos;
    return this;
  }

  public setCategories(categories: Categories) {
    this.categories = categories;
    return this;
  }

  public setEvaluation(evaluation: Evaluation) {
    this.evaluation = evaluation;
    console.debug("EVALUATION: ", evaluation);
    return this;
  }

  public evaluate() {
    const favoriteCategories = new Map<number, number>();
    const leastLikedCategories = new Map<number, number>();

    this.likedVideos?.forEach((likedVideo) => {
      const categoryId = likedVideo.categoryId;
      if (!favoriteCategories.has(categoryId))
        favoriteCategories.set(categoryId, 0);

      favoriteCategories.set(
        categoryId,
        (favoriteCategories.get(categoryId) as number) + 1
      );
    });

    this.dislikedVideos?.forEach((dislikedVideo) => {
      const categoryId = dislikedVideo.categoryId;
      if (leastLikedCategories.has(categoryId))
        leastLikedCategories.set(categoryId, 0);

      leastLikedCategories.set(
        categoryId,
        (leastLikedCategories.get(categoryId) as number) + 1
      );
    });

    return this.setEvaluation({
      favoriteCategories: orderMapByValue(favoriteCategories, false),
      leastLikedCategories: orderMapByValue(leastLikedCategories, true),
    });
  }
}
