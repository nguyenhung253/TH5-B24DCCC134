import { useState, useEffect } from 'react';
import { useModel } from 'umi';
import {
	Table,
	Button,
	Modal,
	Form,
	Input,
	Switch,
	Space,
	Tag,
	message,
	Avatar,
	DatePicker,
	Upload,
	Popconfirm,
} from 'antd';
import {
	DeleteOutlined,
	EditOutlined,
	PlusOutlined,
	TeamOutlined,
	UserOutlined,
	UploadOutlined,
	EyeOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import TinyEditor from '@/components/TinyEditor';

export default function ManageCauLacBo() {
	const cauLacBoModel = useModel('QuanLyCauLacBo.cauLacBo');
	const thanhVienModel = useModel('QuanLyCauLacBo.thanhVien');
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [selectedCauLacBo, setSelectedCauLacBo] = useState<any>(null);
	const [isViewMembersVisible, setIsViewMembersVisible] = useState(false);
	const [selectedMembers, setSelectedMembers] = useState<any[]>([]);
	const [form] = Form.useForm();

	useEffect(() => {
		cauLacBoModel.loadCauLacBo();
		thanhVienModel.loadThanhVien();
	}, []);

	const handleOpenModal = (cauLacBo?: any) => {
		if (cauLacBo) {
			setIsEditing(true);
			setSelectedCauLacBo(cauLacBo);
			form.setFieldsValue({
				tenCauLacBo: cauLacBo.tenCauLacBo,
				ngayThanhLap: dayjs(cauLacBo.ngayThanhLap),
				moTa: cauLacBo.moTa,
				chuNhiem: cauLacBo.chuNhiem,
				hoatDong: cauLacBo.hoatDong,
			});
		} else {
			setIsEditing(false);
			setSelectedCauLacBo(null);
			form.resetFields();
		}
		setIsModalVisible(true);
	};
	const handleSubmit = async (values: any) => {
		try {
			const cauLacBoData = {
				tenCauLacBo: values.tenCauLacBo,
				ngayThanhLap: values.ngayThanhLap.format('YYYY-MM-DD'),
				moTa: values.moTa,
				chuNhiem: values.chuNhiem,
				hoatDong: values.hoatDong ?? true,
				anhDaiDien: values.anhDaiDien,
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
		} catch (error: any) {
			message.error(error.message || 'Có lỗi xảy ra');
		}
	};

	const handleDelete = (id: string) => {
		try {
			cauLacBoModel.deleteCauLacBo(id);
			message.success('Xóa câu lạc bộ thành công');
		} catch (error: any) {
			message.error(error.message || 'Có lỗi xảy ra');
		}
	};

	const handleViewMembers = (cauLacBo: any) => {
		const members = thanhVienModel.getThanhVienByCauLacBo(cauLacBo.id);
		setSelectedMembers(members);
		setSelectedCauLacBo(cauLacBo);
		setIsViewMembersVisible(true);
	};

	const uploadProps = {
		name: 'file',
		action: '/api/upload',
		headers: {
			authorization: 'authorization-text',
		},
		onChange(info: any) {
			if (info.file.status === 'done') {
				message.success(`${info.file.name} file uploaded successfully`);
				form.setFieldsValue({ anhDaiDien: info.file.response.url });
			} else if (info.file.status === 'error') {
				message.error(`${info.file.name} file upload failed.`);
			}
		},
	};
	const columns = [
		{
			title: 'Ảnh đại diện',
			dataIndex: 'anhDaiDien',
			key: 'anhDaiDien',
			width: 80,
			align: 'center' as const,
			render: (anhDaiDien: string) => (
				<Avatar src={anhDaiDien} icon={<TeamOutlined />} size={50} style={{ backgroundColor: '#1890ff' }} />
			),
		},
		{
			title: 'Tên câu lạc bộ',
			dataIndex: 'tenCauLacBo',
			key: 'tenCauLacBo',
			sorter: (a: any, b: any) => a.tenCauLacBo.localeCompare(b.tenCauLacBo),
		},
		{
			title: 'Ngày thành lập',
			dataIndex: 'ngayThanhLap',
			key: 'ngayThanhLap',
			width: 150,
			align: 'center' as const,
			sorter: (a: any, b: any) => new Date(a.ngayThanhLap).getTime() - new Date(b.ngayThanhLap).getTime(),
			render: (ngayThanhLap: string) => dayjs(ngayThanhLap).format('DD/MM/YYYY'),
		},
		{
			title: 'Chủ nhiệm CLB',
			dataIndex: 'chuNhiem',
			key: 'chuNhiem',
			sorter: (a: any, b: any) => a.chuNhiem.localeCompare(b.chuNhiem),
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
			render: (hoatDong: boolean) => (
				<Tag color={hoatDong ? 'success' : 'default'} className={`status-tag ${hoatDong ? 'active' : 'inactive'}`}>
					{hoatDong ? 'Có' : 'Không'}
				</Tag>
			),
		},
		{
			title: 'Hành động',
			key: 'action',
			width: 320,
			align: 'center' as const,
			render: (_: any, record: any) => (
				<Space size='small' className='action-buttons club-action-buttons'>
					<Button type='link' icon={<EyeOutlined />} onClick={() => handleViewMembers(record)}>
						Thành viên
					</Button>
					<Button type='link' icon={<EditOutlined />} onClick={() => handleOpenModal(record)}>
						Sửa
					</Button>
					<Popconfirm
						title='Xóa câu lạc bộ'
						description='Bạn có chắc chắn muốn xóa câu lạc bộ này?'
						onConfirm={() => handleDelete(record.id)}
						okText='Xóa'
						cancelText='Hủy'
					>
						<Button type='text' danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];
	const memberColumns = [
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			key: 'hoTen',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'soDienThoai',
			key: 'soDienThoai',
		},
		{
			title: 'Giới tính',
			dataIndex: 'gioiTinh',
			key: 'gioiTinh',
			width: 100,
			align: 'center' as const,
		},
		{
			title: 'Ngày tham gia',
			dataIndex: 'ngayThamGia',
			key: 'ngayThamGia',
			width: 150,
			align: 'center' as const,
			render: (ngayThamGia: string) => dayjs(ngayThamGia).format('DD/MM/YYYY'),
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

			<Table
				columns={columns}
				dataSource={cauLacBoModel.cauLacBos}
				rowKey='id'
				loading={cauLacBoModel.loading}
				pagination={{
					pageSize: 10,
					showSizeChanger: true,
					showTotal: (total) => `Tổng ${total} câu lạc bộ`,
				}}
			/>

			{/* Modal thêm/sửa câu lạc bộ */}
			<Modal
				title={isEditing ? 'Chỉnh sửa câu lạc bộ' : 'Thêm câu lạc bộ mới'}
				visible={isModalVisible}
				onOk={() => form.submit()}
				onCancel={() => setIsModalVisible(false)}
				width={800}
				confirmLoading={cauLacBoModel.loading}
			>
				<Form form={form} layout='vertical' onFinish={handleSubmit}>
					<div className='avatar-upload'>
						<Upload {...uploadProps} showUploadList={false}>
							<Button icon={<UploadOutlined />}>Tải lên ảnh đại diện</Button>
						</Upload>
					</div>

					<Form.Item
						label='Tên câu lạc bộ'
						name='tenCauLacBo'
						rules={[{ required: true, message: 'Vui lòng nhập tên câu lạc bộ' }]}
					>
						<Input placeholder='Nhập tên câu lạc bộ' />
					</Form.Item>

					<Form.Item
						label='Ngày thành lập'
						name='ngayThanhLap'
						rules={[{ required: true, message: 'Vui lòng chọn ngày thành lập' }]}
					>
						<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' placeholder='Chọn ngày thành lập' />
					</Form.Item>

					<Form.Item
						label='Chủ nhiệm CLB'
						name='chuNhiem'
						rules={[{ required: true, message: 'Vui lòng nhập tên chủ nhiệm' }]}
					>
						<Input placeholder='Nhập tên chủ nhiệm câu lạc bộ' />
					</Form.Item>

					<Form.Item label='Mô tả' name='moTa' rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
						<TinyEditor placeholder='Nhập mô tả về câu lạc bộ' />
					</Form.Item>

					<Form.Item label='Hoạt động' name='hoatDong' valuePropName='checked' initialValue={true}>
						<Switch checkedChildren='Có' unCheckedChildren='Không' />
					</Form.Item>
				</Form>
			</Modal>

			{/* Modal xem danh sách thành viên */}
			<Modal
				title={`Danh sách thành viên - ${selectedCauLacBo?.tenCauLacBo}`}
				visible={isViewMembersVisible}
				onCancel={() => setIsViewMembersVisible(false)}
				footer={null}
				width={1000}
			>
				<Table
					columns={memberColumns}
					dataSource={selectedMembers}
					rowKey='id'
					pagination={{
						pageSize: 5,
						showTotal: (total) => `Tổng ${total} thành viên`,
					}}
				/>
			</Modal>
		</div>
	);
}
