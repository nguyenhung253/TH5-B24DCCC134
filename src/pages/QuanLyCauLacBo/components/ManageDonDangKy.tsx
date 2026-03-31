import { useState, useEffect } from 'react';
import { useModel } from 'umi';
import {
	Table,
	Button,
	Modal,
	Form,
	Input,
	Select,
	Space,
	Tag,
	message,
	Row,
	Col,
	DatePicker,
	Popconfirm,
	Checkbox,
} from 'antd';
import {
	DeleteOutlined,
	EditOutlined,
	PlusOutlined,
	FileTextOutlined,
	EyeOutlined,
	CheckOutlined,
	CloseOutlined,
	SearchOutlined,
	HistoryOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function ManageDonDangKy() {
	const donDangKyModel = useModel('QuanLyCauLacBo.donDangKy');
	const cauLacBoModel = useModel('QuanLyCauLacBo.cauLacBo');
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [isViewDetailVisible, setIsViewDetailVisible] = useState(false);
	const [isHistoryVisible, setIsHistoryVisible] = useState(false);
	const [selectedDonDangKy, setSelectedDonDangKy] = useState<any>(null);
	const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
	const [filteredData, setFilteredData] = useState<any[]>([]);
	const [form] = Form.useForm();
	const [filterForm] = Form.useForm();

	useEffect(() => {
		donDangKyModel.loadDonDangKy();
		cauLacBoModel.loadCauLacBo();
	}, []);

	useEffect(() => {
		setFilteredData(donDangKyModel.donDangKys);
	}, [donDangKyModel.donDangKys]);

	const handleOpenModal = (donDangKy?: any) => {
		if (donDangKy) {
			setIsEditing(true);
			setSelectedDonDangKy(donDangKy);
			form.setFieldsValue({
				hoTen: donDangKy.hoTen,
				email: donDangKy.email,
				soDienThoai: donDangKy.soDienThoai,
				gioiTinh: donDangKy.gioiTinh,
				diaChi: donDangKy.diaChi,
				soTruong: donDangKy.soTruong,
				cauLacBoId: donDangKy.cauLacBoId,
				lyDoDangKy: donDangKy.lyDoDangKy,
			});
		} else {
			setIsEditing(false);
			setSelectedDonDangKy(null);
			form.resetFields();
		}
		setIsModalVisible(true);
	};
	const handleSubmit = async (values: any) => {
		try {
			if (isEditing && selectedDonDangKy) {
				await donDangKyModel.updateDonDangKy(selectedDonDangKy.id, values);
				message.success('Cập nhật đơn đăng ký thành công');
			} else {
				await donDangKyModel.addDonDangKy(values);
				message.success('Thêm đơn đăng ký thành công');
			}

			setIsModalVisible(false);
			form.resetFields();
		} catch (error: any) {
			message.error(error.message || 'Có lỗi xảy ra');
		}
	};

	const handleDelete = (id: string) => {
		try {
			donDangKyModel.deleteDonDangKy(id);
			message.success('Xóa đơn đăng ký thành công');
		} catch (error: any) {
			message.error(error.message || 'Có lỗi xảy ra');
		}
	};

	const handleSingleAction = async (donId: string, action: 'approve' | 'reject', lyDo?: string) => {
		try {
			await donDangKyModel.processSingleAction(donId, action, 'Admin', lyDo);
			message.success(`${action === 'approve' ? 'Duyệt' : 'Từ chối'} đơn đăng ký thành công`);
		} catch (error: any) {
			message.error(error.message || 'Có lỗi xảy ra');
		}
	};

	const handleBulkApprove = () => {
		if (selectedRowKeys.length === 0) {
			message.warning('Vui lòng chọn ít nhất một đơn đăng ký');
			return;
		}

		Modal.confirm({
			title: 'Duyệt đơn đăng ký',
			content: `Bạn có chắc chắn muốn duyệt ${selectedRowKeys.length} đơn đăng ký đã chọn?`,
			onOk: async () => {
				try {
					const count = await donDangKyModel.processBulkAction(
						{
							action: 'approve',
							donDangKyIds: selectedRowKeys,
						},
						'Admin',
					);
					message.success(`Đã duyệt ${count} đơn đăng ký`);
					setSelectedRowKeys([]);
				} catch (error: any) {
					message.error(error.message || 'Có lỗi xảy ra');
				}
			},
		});
	};

	const handleBulkReject = () => {
		if (selectedRowKeys.length === 0) {
			message.warning('Vui lòng chọn ít nhất một đơn đăng ký');
			return;
		}

		let lyDo = '';
		Modal.confirm({
			title: 'Từ chối đơn đăng ký',
			content: (
				<div>
					<p>Bạn có chắc chắn muốn từ chối {selectedRowKeys.length} đơn đăng ký đã chọn?</p>
					<Input.TextArea
						placeholder='Nhập lý do từ chối (bắt buộc)'
						onChange={(e) => (lyDo = e.target.value)}
						rows={3}
					/>
				</div>
			),
			onOk: async () => {
				if (!lyDo.trim()) {
					message.error('Vui lòng nhập lý do từ chối');
					return;
				}

				try {
					const count = await donDangKyModel.processBulkAction(
						{
							action: 'reject',
							donDangKyIds: selectedRowKeys,
							lyDo,
						},
						'Admin',
					);
					message.success(`Đã từ chối ${count} đơn đăng ký`);
					setSelectedRowKeys([]);
				} catch (error: any) {
					message.error(error.message || 'Có lỗi xảy ra');
				}
			},
		});
	};
	const handleFilter = (values: any) => {
		const filter = {
			trangThai: values.trangThai,
			cauLacBoId: values.cauLacBoId,
			tuNgay: values.dateRange?.[0]?.format('YYYY-MM-DD'),
			denNgay: values.dateRange?.[1]?.format('YYYY-MM-DD'),
			keyword: values.keyword,
		};

		const filtered = donDangKyModel.filterDonDangKy(filter);
		setFilteredData(filtered);
	};

	const handleResetFilter = () => {
		filterForm.resetFields();
		setFilteredData(donDangKyModel.donDangKys);
	};

	const handleViewDetail = (donDangKy: any) => {
		setSelectedDonDangKy(donDangKy);
		setIsViewDetailVisible(true);
	};

	const handleViewHistory = (donDangKy: any) => {
		setSelectedDonDangKy(donDangKy);
		setIsHistoryVisible(true);
	};

	const getCauLacBoName = (cauLacBoId: string) => {
		const cauLacBo = cauLacBoModel.cauLacBos.find((clb) => clb.id === cauLacBoId);
		return cauLacBo?.tenCauLacBo || 'N/A';
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: (selectedKeys: string[]) => {
			setSelectedRowKeys(selectedKeys);
		},
		getCheckboxProps: (record: any) => ({
			disabled: record.trangThai !== 'Pending',
		}),
	};

	const columns = [
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			key: 'hoTen',
			sorter: (a: any, b: any) => a.hoTen.localeCompare(b.hoTen),
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
			width: 130,
		},
		{
			title: 'Giới tính',
			dataIndex: 'gioiTinh',
			key: 'gioiTinh',
			width: 100,
			align: 'center' as const,
		},
		{
			title: 'Câu lạc bộ',
			dataIndex: 'cauLacBoId',
			key: 'cauLacBoId',
			render: (cauLacBoId: string) => getCauLacBoName(cauLacBoId),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			key: 'trangThai',
			width: 120,
			align: 'center' as const,
			filters: [
				{ text: 'Chờ duyệt', value: 'Pending' },
				{ text: 'Đã duyệt', value: 'Approved' },
				{ text: 'Từ chối', value: 'Rejected' },
			],
			onFilter: (value: any, record: any) => record.trangThai === value,
			render: (trangThai: string) => {
				const config = {
					Pending: { color: 'warning', text: 'Chờ duyệt', className: 'pending' },
					Approved: { color: 'success', text: 'Đã duyệt', className: 'approved' },
					Rejected: { color: 'error', text: 'Từ chối', className: 'rejected' },
				};
				const { color, text, className } = config[trangThai as keyof typeof config];
				return (
					<Tag color={color} className={`status-tag ${className}`}>
						{text}
					</Tag>
				);
			},
		},
		{
			title: 'Ngày đăng ký',
			dataIndex: 'ngayDangKy',
			key: 'ngayDangKy',
			width: 130,
			align: 'center' as const,
			sorter: (a: any, b: any) => new Date(a.ngayDangKy).getTime() - new Date(b.ngayDangKy).getTime(),
			render: (ngayDangKy: string) => dayjs(ngayDangKy).format('DD/MM/YYYY'),
		},
		{
			title: 'Hành động',
			key: 'action',
			width: 420,
			align: 'center' as const,
			render: (_: any, record: any) => (
				<Space size='small' className='action-buttons'>
					<Button type='link' icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
						Chi tiết
					</Button>
					{record.trangThai === 'Pending' && (
						<>
							<Popconfirm
								title='Duyệt đơn đăng ký'
								description='Bạn có chắc chắn muốn duyệt đơn này?'
								onConfirm={() => handleSingleAction(record.id, 'approve')}
								okText='Duyệt'
								cancelText='Hủy'
							>
								<Button type='link' icon={<CheckOutlined />} style={{ color: '#52c41a' }}>
									Duyệt
								</Button>
							</Popconfirm>
							<Button
								type='link'
								icon={<CloseOutlined />}
								style={{ color: '#ff4d4f' }}
								onClick={() => {
									let lyDo = '';
									Modal.confirm({
										title: 'Từ chối đơn đăng ký',
										content: (
											<Input.TextArea
												placeholder='Nhập lý do từ chối (bắt buộc)'
												onChange={(e) => (lyDo = e.target.value)}
												rows={3}
											/>
										),
										onOk: () => {
											if (!lyDo.trim()) {
												message.error('Vui lòng nhập lý do từ chối');
												return;
											}
											handleSingleAction(record.id, 'reject', lyDo);
										},
									});
								}}
							>
								Từ chối
							</Button>
						</>
					)}
					<Button type='link' icon={<HistoryOutlined />} onClick={() => handleViewHistory(record)}>
						Lịch sử
					</Button>
					<Button
						type='link'
						icon={<EditOutlined />}
						onClick={() => handleOpenModal(record)}
						disabled={record.trangThai !== 'Pending'}
					>
						Sửa
					</Button>
					<Popconfirm
						title='Xóa đơn đăng ký'
						description='Bạn có chắc chắn muốn xóa đơn này?'
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
	return (
		<div className='card-section'>
			<div className='section-header'>
				<h3 className='section-title'>
					<FileTextOutlined /> Quản lý đơn đăng ký
				</h3>
				<Button type='primary' icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
					Thêm đơn đăng ký
				</Button>
			</div>

			{/* Bộ lọc */}
			<div className='filter-section'>
				<Form form={filterForm} onFinish={handleFilter}>
					<Row gutter={16} className='filter-row'>
						<Col span={6}>
							<Form.Item label='Trạng thái' name='trangThai'>
								<Select placeholder='Chọn trạng thái' allowClear>
									<Option value='Pending'>Chờ duyệt</Option>
									<Option value='Approved'>Đã duyệt</Option>
									<Option value='Rejected'>Từ chối</Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item label='Câu lạc bộ' name='cauLacBoId'>
								<Select placeholder='Chọn câu lạc bộ' allowClear>
									{cauLacBoModel.cauLacBos.map((clb) => (
										<Option key={clb.id} value={clb.id}>
											{clb.tenCauLacBo}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item label='Khoảng thời gian' name='dateRange'>
								<RangePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item label='Từ khóa' name='keyword'>
								<Input placeholder='Tìm theo tên, email, SĐT' />
							</Form.Item>
						</Col>
						<Col span={24}>
							<div className='filter-buttons'>
								<Button type='primary' htmlType='submit' icon={<SearchOutlined />}>
									Tìm kiếm
								</Button>
								<Button onClick={handleResetFilter}>Đặt lại</Button>
							</div>
						</Col>
					</Row>
				</Form>
			</div>

			{/* Bulk actions */}
			{selectedRowKeys.length > 0 && (
				<div className='bulk-actions'>
					<div className='bulk-info'>Đã chọn {selectedRowKeys.length} đơn đăng ký</div>
					<div className='bulk-buttons'>
						<Button type='primary' icon={<CheckOutlined />} onClick={handleBulkApprove}>
							Duyệt {selectedRowKeys.length} đơn đã chọn
						</Button>
						<Button danger icon={<CloseOutlined />} onClick={handleBulkReject}>
							Từ chối {selectedRowKeys.length} đơn đã chọn
						</Button>
					</div>
				</div>
			)}

			<Table
				className='registration-table'
				columns={columns}
				dataSource={filteredData}
				rowKey='id'
				loading={donDangKyModel.loading}
				rowSelection={rowSelection}
				scroll={{ x: 1400 }}
				pagination={{
					pageSize: 10,
					showSizeChanger: true,
					showTotal: (total) => `Tổng ${total} đơn đăng ký`,
				}}
			/>

			{/* Modal thêm/sửa đơn đăng ký */}
			<Modal
				title={isEditing ? 'Chỉnh sửa đơn đăng ký' : 'Thêm đơn đăng ký mới'}
				visible={isModalVisible}
				onOk={() => form.submit()}
				onCancel={() => setIsModalVisible(false)}
				width={800}
				confirmLoading={donDangKyModel.loading}
			>
				<Form form={form} layout='vertical' onFinish={handleSubmit}>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item label='Họ tên' name='hoTen' rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
								<Input placeholder='Nhập họ tên' />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								label='Email'
								name='email'
								rules={[
									{ required: true, message: 'Vui lòng nhập email' },
									{ type: 'email', message: 'Email không đúng định dạng' },
								]}
							>
								<Input placeholder='Nhập email' />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								label='Số điện thoại'
								name='soDienThoai'
								rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
							>
								<Input placeholder='Nhập số điện thoại' />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								label='Giới tính'
								name='gioiTinh'
								rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
							>
								<Select placeholder='Chọn giới tính'>
									<Option value='Nam'>Nam</Option>
									<Option value='Nữ'>Nữ</Option>
									<Option value='Khác'>Khác</Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>

					<Form.Item label='Địa chỉ' name='diaChi' rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
						<Input placeholder='Nhập địa chỉ' />
					</Form.Item>

					<Form.Item label='Sở trường' name='soTruong' rules={[{ required: true, message: 'Vui lòng nhập sở trường' }]}>
						<Input placeholder='Nhập sở trường' />
					</Form.Item>

					<Form.Item
						label='Câu lạc bộ'
						name='cauLacBoId'
						rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ' }]}
					>
						<Select placeholder='Chọn câu lạc bộ'>
							{cauLacBoModel.getActiveCauLacBo().map((clb) => (
								<Option key={clb.id} value={clb.id}>
									{clb.tenCauLacBo}
								</Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item
						label='Lý do đăng ký'
						name='lyDoDangKy'
						rules={[{ required: true, message: 'Vui lòng nhập lý do đăng ký' }]}
					>
						<Input.TextArea rows={4} placeholder='Nhập lý do đăng ký' />
					</Form.Item>
				</Form>
			</Modal>

			{/* Modal xem chi tiết */}
			<Modal
				title='Chi tiết đơn đăng ký'
				visible={isViewDetailVisible}
				onCancel={() => setIsViewDetailVisible(false)}
				footer={null}
				width={600}
			>
				{selectedDonDangKy && (
					<div>
						<Row gutter={16}>
							<Col span={12}>
								<strong>Họ tên:</strong> {selectedDonDangKy.hoTen}
							</Col>
							<Col span={12}>
								<strong>Email:</strong> {selectedDonDangKy.email}
							</Col>
						</Row>
						<br />
						<Row gutter={16}>
							<Col span={12}>
								<strong>Số điện thoại:</strong> {selectedDonDangKy.soDienThoai}
							</Col>
							<Col span={12}>
								<strong>Giới tính:</strong> {selectedDonDangKy.gioiTinh}
							</Col>
						</Row>
						<br />
						<Row gutter={16}>
							<Col span={24}>
								<strong>Địa chỉ:</strong> {selectedDonDangKy.diaChi}
							</Col>
						</Row>
						<br />
						<Row gutter={16}>
							<Col span={12}>
								<strong>Sở trường:</strong> {selectedDonDangKy.soTruong}
							</Col>
							<Col span={12}>
								<strong>Câu lạc bộ:</strong> {getCauLacBoName(selectedDonDangKy.cauLacBoId)}
							</Col>
						</Row>
						<br />
						<Row gutter={16}>
							<Col span={24}>
								<strong>Lý do đăng ký:</strong>
							</Col>
							<Col span={24}>{selectedDonDangKy.lyDoDangKy}</Col>
						</Row>
						<br />
						<Row gutter={16}>
							<Col span={12}>
								<strong>Trạng thái:</strong>
								<Tag
									color={
										selectedDonDangKy.trangThai === 'Pending'
											? 'warning'
											: selectedDonDangKy.trangThai === 'Approved'
											? 'success'
											: 'error'
									}
								>
									{selectedDonDangKy.trangThai === 'Pending'
										? 'Chờ duyệt'
										: selectedDonDangKy.trangThai === 'Approved'
										? 'Đã duyệt'
										: 'Từ chối'}
								</Tag>
							</Col>
							<Col span={12}>
								<strong>Ngày đăng ký:</strong> {dayjs(selectedDonDangKy.ngayDangKy).format('DD/MM/YYYY HH:mm')}
							</Col>
						</Row>
						{selectedDonDangKy.ghiChu && (
							<>
								<br />
								<Row gutter={16}>
									<Col span={24}>
										<strong>Ghi chú:</strong> {selectedDonDangKy.ghiChu}
									</Col>
								</Row>
							</>
						)}
					</div>
				)}
			</Modal>

			{/* Modal xem lịch sử */}
			<Modal
				title='Lịch sử thao tác'
				visible={isHistoryVisible}
				onCancel={() => setIsHistoryVisible(false)}
				footer={null}
				width={800}
			>
				{selectedDonDangKy && (
					<Table
						dataSource={donDangKyModel.getLichSuByDonId(selectedDonDangKy.id)}
						rowKey='id'
						pagination={false}
						columns={[
							{
								title: 'Hành động',
								dataIndex: 'hanhDong',
								key: 'hanhDong',
								render: (hanhDong: string) => (
									<Tag color={hanhDong === 'Approved' ? 'success' : 'error'}>
										{hanhDong === 'Approved' ? 'Duyệt' : 'Từ chối'}
									</Tag>
								),
							},
							{
								title: 'Người thực hiện',
								dataIndex: 'nguoiThucHien',
								key: 'nguoiThucHien',
							},
							{
								title: 'Thời gian',
								dataIndex: 'thoiGian',
								key: 'thoiGian',
								render: (thoiGian: string) => dayjs(thoiGian).format('DD/MM/YYYY HH:mm'),
							},
							{
								title: 'Lý do',
								dataIndex: 'lyDo',
								key: 'lyDo',
							},
						]}
					/>
				)}
			</Modal>
		</div>
	);
}
