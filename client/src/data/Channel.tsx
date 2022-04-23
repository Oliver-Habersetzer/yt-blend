import moment from "moment";

export default interface Channel {
  name: string;
  thumbnail?: string;
  image?: string;
  videoCount: number;
  created: moment.Moment;
  id: string;
  resourceId: string;
}
