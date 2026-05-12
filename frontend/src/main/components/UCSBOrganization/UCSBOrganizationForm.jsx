import { Button, Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

function UCSBOrganizationForm({
  initialContents,
  submitAction,
  buttonLabel = "Create",
}) {
  // Stryker disable all
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
  defaultValues: initialContents
    ? {
        ...initialContents,
        inactive: String(initialContents.inactive),
      }
    : {},
  });
  // Stryker restore all

  const navigate = useNavigate();

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="orgCode">Org Code</Form.Label>
            <Form.Control
              data-testid="UCSBOrganizationForm-orgCode"
              id="orgCode"
              type="text"
              isInvalid={Boolean(errors.orgCode)}
              {...register("orgCode", {
                required: "Org Code is required.",
              })}
              disabled={Boolean(initialContents)}
            />
            <Form.Control.Feedback type="invalid">
              {errors.orgCode?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="orgTranslationShort">
              Org Translation Short
            </Form.Label>
            <Form.Control
              data-testid="UCSBOrganizationForm-orgTranslationShort"
              id="orgTranslationShort"
              type="text"
              isInvalid={Boolean(errors.orgTranslationShort)}
              {...register("orgTranslationShort", {
                required: "Org Translation Short is required.",
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.orgTranslationShort?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="orgTranslation">Org Translation</Form.Label>
            <Form.Control
              data-testid="UCSBOrganizationForm-orgTranslation"
              id="orgTranslation"
              type="text"
              isInvalid={Boolean(errors.orgTranslation)}
              {...register("orgTranslation", {
                required: "Org Translation is required.",
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.orgTranslation?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="inactive">Inactive</Form.Label>
            <Form.Select
              data-testid="UCSBOrganizationForm-inactive"
              id="inactive"
              isInvalid={Boolean(errors.inactive)}
              {...register("inactive", {
                required: "Inactive is required.",
              })}
            >
              <option value="">Select inactive status</option>
              <option value="false">False</option>
              <option value="true">True</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.inactive?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Button type="submit" data-testid="UCSBOrganizationForm-submit">
            {buttonLabel}
          </Button>
          <Button
            variant="Secondary"
            onClick={() => navigate(-1)}
            data-testid="UCSBOrganizationForm-cancel"
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default UCSBOrganizationForm;
