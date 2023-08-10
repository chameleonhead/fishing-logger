import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { Ship } from "./models";

type ShipCreateFormProps = {
  onSubmit: (value: Ship) => void;
};

export const ShipCreateForm = ({ onSubmit }: ShipCreateFormProps) => {
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("必ず入力してください。"),
    }),
    onSubmit: (values) => {
      onSubmit({
        name: values.name,
      } as Ship);
    },
  });
  return (
    <Form onSubmit={formik.handleSubmit}>
      <FormGroup>
        <Label for="name">名前</Label>
        <Input
          id="name"
          name="name"
          placeholder="例) クイーンエリザベス"
          type="text"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </FormGroup>
      <Button type="submit" color="primary" block>
        登録
      </Button>
    </Form>
  );
};

export const ShipCreateFormWithState = function ({
  onSuccess,
}: {
  onSuccess: (value: Ship) => void;
}) {
  return (
    <ShipCreateForm
      onSubmit={async (value) => {
        try {
          const result = await fetch("/api/ships", {
            method: "POST",
            body: JSON.stringify(value),
          });
          if (result.ok) {
            onSuccess(await result.json());
          } else {
            alert("登録できませんでした。");
          }
        } catch (e) {
          alert(e);
        }
      }}
    />
  );
};

export default ShipCreateFormWithState;
