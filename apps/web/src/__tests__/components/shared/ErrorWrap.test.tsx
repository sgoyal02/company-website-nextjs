import {
  render,
  screen,
} from "@testing-library/react";
import ErrorWrap from "@/components/shared/ErrorWrap";

describe("Error wrap comp- tests", ()=>{
    it("children render on no err- test", ()=>{
        render(
        <ErrorWrap>
            <p>App content</p>
        </ErrorWrap>
        );
        expect(screen.getByText("App content")).toBeInTheDocument();
    });

    it("comp throw err, showing error ui", ()=>{
        const ChildErrComp=()=>{
            throw new Error("Test err msg")
        }
        render(
        <ErrorWrap>
            <ChildErrComp/>
        </ErrorWrap>
        );

        expect(screen.getByText("Something went wrong")).toBeInTheDocument();
        expect(screen.getByText("Test err msg")).toBeInTheDocument();
         expect(screen.getByRole("button", {name:"Retry"})).toBeInTheDocument();
    });

});
