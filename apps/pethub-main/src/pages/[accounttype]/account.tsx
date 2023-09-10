import { useRouter } from "next/router";

export default function Account() {
  const router = useRouter();
  return <>account page, I am a {router.query.accounttype}</>;
}
