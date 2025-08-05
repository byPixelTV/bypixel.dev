import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function usePost(slug: string) {
  return useSWR(`/api/posts/${slug}`, fetcher);
}