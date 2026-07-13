import { GetStaticPaths, GetStaticProps } from "next";

export default function BlogDetail() {
  return <h1>Blog Detail Works</h1>;
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};