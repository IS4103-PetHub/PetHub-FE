import { useRouter } from "next/router";

export default function Shared1() {
  const router = useRouter();
  return <>shared page 1, I am a {router.query.accounttype}</>;
}
