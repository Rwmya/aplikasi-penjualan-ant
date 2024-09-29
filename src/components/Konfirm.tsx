import { Modal } from "antd";

type OnOkFunction = () => Promise<Response>;

function PopUp(judul: string, konten: string, fn: OnOkFunction) {
  Modal.confirm({
    title: judul,
    content: konten,
    okText: "Ya",
    okType: "danger",
    cancelText: "Batal",
    onOk() {
      fn().then(() => {
        window.location.reload();
      });
    },
  });
}

export default PopUp;
