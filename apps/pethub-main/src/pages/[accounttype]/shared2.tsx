import { useRouter } from "next/router";

export default function Shared2() {
  const router = useRouter();
  return <>shared page 2, I am a {router.query.accounttype}</>;
}
