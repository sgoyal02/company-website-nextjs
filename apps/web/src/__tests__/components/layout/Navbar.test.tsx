import { render, screen } from "@testing-library/react";
import Navbar from "@/components/layout/Navbar";

jest.mock("next/link", () => {
  return ({ children, href }: any) => (
    <a href={href}>
      {children}
    </a>
  );
});

describe("navbar tests", ()=>{
    it("render compName from strapi-test", ()=>{
        render(<Navbar settings={{companyName:"Test comp"}}/>);
        expect(screen.getByText("Test comp")).toBeInTheDocument();
    });

    it("fallback logo- test", ()=>{
        render(<Navbar settings={{companyName:"Test comp"}}/>);
        expect(screen.getByText("T")).toBeInTheDocument();
    });

    it("all links render- test", ()=>{
        render(<Navbar settings={{companyName:"Test comp"}}/>);
        expect(screen.getByText("Home")).toBeInTheDocument();
        expect(screen.getByText("Services")).toBeInTheDocument();
        expect(screen.getByText("Blogs")).toBeInTheDocument();
        expect(screen.getByText("Contact")).toBeInTheDocument();
    });

    it("logo img render- test", ()=>{
        render(<Navbar settings={
            {companyName:"Test comp", logo:{url:"/logo.png"}}
        }/>);
        const imgData= screen.getByAltText("Test comp");
        expect(imgData).toHaveAttribute(
            "src", expect.stringContaining("/logo.png")
        );
    });
})
