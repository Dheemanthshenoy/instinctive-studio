export const responseDelivery = (res, status = 200, message = 'Success', data = null, error = null) => {
    return res.status(status).json({ message, data, error })
}