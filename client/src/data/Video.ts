export default interface Video {
  id: string;
  comments: number;
  likes: number;
  views: number;
  published: moment.Moment;
  title: string;
  channel: {
    id: string;
    name: string;
  };
  categoryId: number;
  thumbnail: string;
  image: string;
}
