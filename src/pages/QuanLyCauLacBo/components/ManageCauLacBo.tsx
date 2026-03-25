import { useState, useEffect } from 'react';
import { useModel } from 'umi';
import { Table, Button, Modal, Form, Input, DatePicker, Space, Tag, message, Switch, Image, Upload } from 'antd';
import {
	DeleteOutlined,
	EditOutlined,
	PlusOutlined,
	TeamOutlined,
	EyeOutlined,
	UploadOutlined,
} from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import moment from 'moment';
import type { UploadFile } from 'antd/es/upload/interface';

export default function ManageCauLacBo() {
	const cauLacBoModel = useModel('QuanLyCauLacBo.CauLacBo');
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [selectedCauLacBo, setSelectedCauLacBo] = useState<any>(null);
	const [form] = Form.useForm();
	const [moTaContent, setMoTaContent] = useState('');
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [searchText, setSearchText] = useState('');



	const handleOpenModal = (cauLacBo?: any) => {
		if (cauLacBo) {
			setIsEditing(true);
			setSelectedCauLacBo(cauLacBo);
			setMoTaContent(cauLacBo.moTa || '');
			form.setFieldsValue({
				tenCLB: cauLacBo.tenCLB,
				ngayThanhLap: moment(cauLacBo.ngayThanhLap),
				chuNhiemCLB: cauLacBo.chuNhiemCLB,
				hoatDong: cauLacBo.hoatDong,
			});
			if (cauLacBo.anhDaiDien) {
				setFileList([
					{
						uid: '-1',
						name: 'image.png',
						status: 'done',
						url: cauLacBo.anhDaiDien,
					},
				]);
			}
		} else {
			setIsEditing(false);
			setSelectedCauLacBo(null);
			setMoTaContent('');
			setFileList([]);
			form.resetFields();
			form.setFieldsValue({ hoatDong: true });
		}
		setIsModalVisible(true);
	};

	const handleSubmit = async (values: any) => {
		try {
			const cauLacBoData = {
				tenCLB: values.tenCLB,
				ngayThanhLap: values.ngayThanhLap.format('YYYY-MM-DD'),
				moTa: moTaContent,
				chuNhiemCLB: values.chuNhiemCLB,
				hoatDong: values.hoatDong || false,
				anhDaiDien: fileList.length > 0 ? fileList[0].url || fileList[0].thumbUrl || '/logo.png' : '/logo.png',
			};

			if (isEditing && selectedCauLacBo) {
				await cauLacBoModel.updateCauLacBo(selectedCauLacBo.id, cauLacBoData);
				message.success('Cập nhật câu lạc bộ thành công');
			} else {
				await cauLacBoModel.addCauLacBo(cauLacBoData);
				message.success('Thêm câu lạc bộ thành công');
			}

			setIsModalVisible(false);
			form.resetFields();
			setMoTaContent('');
			setFileList([]);
		} catch (error: any) {
			message.error(error.message || 'Có lỗi xảy ra');
		}
	};

	const handleDelete = (id: string) => {
		Modal.confirm({
			title: 'Xóa câu lạc bộ',
			content: 'Bạn có chắc chắn muốn xóa câu lạc bộ này? Hành động này không thể hoàn tác.',
			okText: 'Xóa',
			cancelText: 'Hủy',
			okButtonProps: { danger: true },
			onOk() {
				try {
					cauLacBoModel.deleteCauLacBo(id);
					message.success('Xóa câu lạc bộ thành công');
				} catch (error: any) {
					message.error(error.message || 'Có lỗi xảy ra');
				}
			},
		});
	};

	const handleViewMembers = (cauLacBo: any) => {
		message.info(`Xem danh sách thành viên của ${cauLacBo.tenCLB}`);
		// TODO: Navigate to members list
	};

	const handleUploadChange = ({ fileList: newFileList }: any) => {
		setFileList(newFileList);
	};

	const beforeUpload = (file: File) => {
		const isImage = file.type.startsWith('image/');
		if (!isImage) {
			message.error('Chỉ được upload file ảnh!');
			return false;
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			message.error('Ảnh phải nhỏ hơn 2MB!');
			return false;
		}

		// Convert to base64 for preview
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			setFileList([
				{
					uid: file.uid,
					name: file.name,
					status: 'done',
					url: reader.result as string,
				},
			]);
		};
		return false;
	};

	// Filter data based on search
	const filteredData = cauLacBoModel.cauLacBos.filter((clb) => {
		const searchLower = searchText.toLowerCase();
		return clb.tenCLB.toLowerCase().includes(searchLower) || clb.chuNhiemCLB.toLowerCase().includes(searchLower);
	});

	const columns = [
		{
			title: 'Ảnh đại diện',
			dataIndex: 'anhDaiDien',
			key: 'anhDaiDien',
			width: 100,
			render: (anhDaiDien: string) => (
				<Image src={anhDaiDien} width={60} height={60} style={{ objectFit: 'cover', borderRadius: 8 }} />
			),
		},
		{
			title: 'Tên câu lạc bộ',
			dataIndex: 'tenCLB',
			key: 'tenCLB',
			width: 200,
			sorter: (a: any, b: any) => a.tenCLB.localeCompare(b.tenCLB),
			render: (tenCLB: string) => <strong>{tenCLB}</strong>,
		},
		{
			title: 'Ngày thành lập',
			dataIndex: 'ngayThanhLap',
			key: 'ngayThanhLap',
			width: 150,
			sorter: (a: any, b: any) => new Date(a.ngayThanhLap).getTime() - new Date(b.ngayThanhLap).getTime(),
			render: (ngayThanhLap: string) => moment(ngayThanhLap).format('DD/MM/YYYY'),
		},
		{
			title: 'Chủ nhiệm CLB',
			dataIndex: 'chuNhiemCLB',
			key: 'chuNhiemCLB',
			width: 150,
			sorter: (a: any, b: any) => a.chuNhiemCLB.localeCompare(b.chuNhiemCLB),
		},
		{
			title: 'Hoạt động',
			dataIndex: 'hoatDong',
			key: 'hoatDong',
			width: 120,
			align: 'center' as const,
			filters: [
				{ text: 'Có', value: true },
				{ text: 'Không', value: false },
			],
			onFilter: (value: any, record: any) => record.hoatDong === value,
			render: (hoatDong: boolean) => <Tag color={hoatDong ? 'success' : 'default'}>{hoatDong ? 'Có' : 'Không'}</Tag>,
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'ngayTao',
			key: 'ngayTao',
			width: 120,
			sorter: (a: any, b: any) => new Date(a.ngayTao).getTime() - new Date(b.ngayTao).getTime(),
			render: (ngayTao: string) => moment(ngayTao).format('DD/MM/YYYY'),
		},
		{
			title: 'Hành động',
			key: 'action',
			width: 200,
			align: 'center' as const,
			fixed: 'right' as const,
			render: (_: any, record: any) => (
				<Space size='small' className='action-buttons'>
					<Button type='link' icon={<EyeOutlined />} onClick={() => handleViewMembers(record)}>
						Thành viên
					</Button>
					<Button type='link' icon={<EditOutlined />} onClick={() => handleOpenModal(record)}>
						Sửa
					</Button>
					<Button type='text' danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
						Xóa
					</Button>
				</Space>
			),
		},
	];

	return (
		<div className='card-section'>
			<div className='section-header'>
				<h3 className='section-title'>
					<TeamOutlined /> Danh sách câu lạc bộ
				</h3>
				<Button type='primary' icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
					Thêm câu lạc bộ
				</Button>
			</div>

			<div style={{ marginBottom: 16 }}>
				<Input.Search
					placeholder='Tìm kiếm theo tên CLB hoặc chủ nhiệm...'
					allowClear
					onSearch={setSearchText}
					onChange={(e) => setSearchText(e.target.value)}
					style={{ width: 400 }}
				/>
			</div>

			<Table
				columns={columns}
				dataSource={filteredData}
				rowKey='id'
				loading={cauLacBoModel.loading}
				scroll={{ x: 1200 }}
				pagination={{
					pageSize: 10,
					showSizeChanger: true,
					showTotal: (total) => `Tổng ${total} câu lạc bộ`,
				}}
			/>

			<Modal
				title={isEditing ? 'Chỉnh sửa câu lạc bộ' : 'Thêm câu lạc bộ mới'}
				visible={isModalVisible}
				onOk={() => form.submit()}
				onCancel={() => {
					setIsModalVisible(false);
					setMoTaContent('');
					setFileList([]);
				}}
				width={800}
				confirmLoading={cauLacBoModel.loading}
			>
				<Form form={form} layout='vertical' onFinish={handleSubmit}>
					<Form.Item label='Ảnh đại diện'>
						<Upload
							listType='picture-card'
							fileList={fileList}
							onChange={handleUploadChange}
							beforeUpload={beforeUpload}
							maxCount={1}
						>
							{fileList.length === 0 && (
								<div>
									<UploadOutlined />
									<div style={{ marginTop: 8 }}>Upload</div>
								</div>
							)}
						</Upload>
					</Form.Item>

					<Form.Item
						label='Tên câu lạc bộ'
						name='tenCLB'
						rules={[{ required: true, message: 'Vui lòng nhập tên câu lạc bộ' }]}
					>
						<Input placeholder='Nhập tên câu lạc bộ' />
					</Form.Item>

					<Form.Item
						label='Ngày thành lập'
						name='ngayThanhLap'
						rules={[{ required: true, message: 'Vui lòng chọn ngày thành lập' }]}
					>
						<DatePicker placeholder='Chọn ngày thành lập' style={{ width: '100%' }} format='DD/MM/YYYY' />
					</Form.Item>

					<Form.Item label='Mô tả'>
						<Editor
							apiKey='your-tinymce-api-key'
							value={moTaContent}
							init={{
								height: 300,
								menubar: false,
								plugins: ['lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'code'],
								toolbar:
									'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | link image | code',
							}}
							onEditorChange={(content) => setMoTaContent(content)}
						/>
					</Form.Item>

					<Form.Item
						label='Chủ nhiệm CLB'
						name='chuNhiemCLB'
						rules={[{ required: true, message: 'Vui lòng nhập tên chủ nhiệm' }]}
					>
						<Input placeholder='Nhập tên chủ nhiệm CLB' />
					</Form.Item>

					<Form.Item label='Hoạt động' name='hoatDong' valuePropName='checked'>
						<Switch checkedChildren='Có' unCheckedChildren='Không' />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
}
