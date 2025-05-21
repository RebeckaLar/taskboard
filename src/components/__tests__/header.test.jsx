import '@testing-library/jest-dom' 
import { render, screen } from '@testing-library/react' //Incluced in ALL tests
import { Header } from '../header'

//Describes our site. Embodies multiple tests. All tests in this suite is about the Header-component
describe("Header", () => {
    it('should render the same headline passed as props', () => {
        // ARRANGE our components:
        render(<Header />)

        // ACT like an event 
        const headingElement = screen.getByText("")
        //Screen finds an element
        // i = case insensitive

        // ASSERT
        expect(headingElement).toBeInTheDocument()
    })
})
