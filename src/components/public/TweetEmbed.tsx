import { Tweet } from "react-tweet";

export default function TweetEmbed({ tweetId }: { tweetId: string }) {
  return (
    <div className="flex justify-center my-6">
      <Tweet id={tweetId} />
    </div>
  );
}
