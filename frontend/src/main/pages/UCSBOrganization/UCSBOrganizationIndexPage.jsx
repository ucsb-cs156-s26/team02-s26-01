import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { Link } from "react-router";

export default function UCSBOrganizationIndexPage() {
  // Stryker disable all : placeholder page
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Index page not yet implemented</h1>
        <p>
          <Link to="/ucsborganizations/create">Create</Link>
        </p>
        <p>
          <Link to="/ucsborganizations/edit/DSClub">Edit</Link>
        </p>
      </div>
    </BasicLayout>
  );
}
