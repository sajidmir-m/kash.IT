from flask_mail import Message
from threading import Thread


def send_async_email(app, mail, msg):
    with app.app_context():
        mail.send(msg)


def send_otp_email(mail, app, recipient, otp_code):
    msg = Message(
        subject='Kash.it - Email Verification OTP',
        recipients=[recipient]
    )
    msg.body = f'''
Hello,

Your OTP for email verification is: {otp_code}

This OTP will expire in 10 minutes.

If you did not request this, please ignore this email.

Best regards,
Kash.it Team
'''
    msg.html = f'''
<html>
  <body>
    <h2>Email Verification</h2>
    <p>Your OTP for email verification is:</p>
    <h1 style="color: #4CAF50; font-size: 36px; letter-spacing: 5px;">{otp_code}</h1>
    <p>This OTP will expire in 10 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
    <br>
    <p>Best regards,<br>Kash.it Team</p>
  </body>
</html>
'''
    
    thread = Thread(target=send_async_email, args=(app, mail, msg))
    thread.start()
    return thread


def send_password_reset_email(mail, app, recipient, otp_code):
    msg = Message(
        subject='Kash.it - Password Reset OTP',
        recipients=[recipient]
    )
    msg.body = f'''
Hello,

Your OTP for password reset is: {otp_code}

This OTP will expire in 10 minutes.

If you did not request this, please ignore this email and your password will remain unchanged.

Best regards,
Kash.it Team
'''
    msg.html = f'''
<html>
  <body>
    <h2>Password Reset</h2>
    <p>Your OTP for password reset is:</p>
    <h1 style="color: #FF9800; font-size: 36px; letter-spacing: 5px;">{otp_code}</h1>
    <p>This OTP will expire in 10 minutes.</p>
    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    <br>
    <p>Best regards,<br>Kash.it Team</p>
  </body>
</html>
'''
    
    thread = Thread(target=send_async_email, args=(app, mail, msg))
    thread.start()
    return thread


def send_vendor_credentials_email(mail, app, recipient, temp_password, business_name):
    msg = Message(
        subject='Kash.it - Vendor Account Created',
        recipients=[recipient]
    )
    msg.body = f'''
Hello {business_name},

Your vendor account has been created successfully!

Login Credentials:
Email: {recipient}
Temporary Password: {temp_password}

Please login at: http://localhost:5173/vendor-login
(Change your password after first login)

You can now:
- Add products to your assigned categories
- Manage your product inventory
- View and fulfill orders
- Track your sales

Best regards,
Kash.it Admin Team
'''
    msg.html = f'''
<html>
  <body>
    <h2>Vendor Account Created</h2>
    <p>Hello <strong>{business_name}</strong>,</p>
    <p>Your vendor account has been created successfully!</p>
    
    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3>Login Credentials:</h3>
      <p><strong>Email:</strong> {recipient}</p>
      <p><strong>Temporary Password:</strong> <code style="background-color: #e0e0e0; padding: 2px 5px; border-radius: 3px;">{temp_password}</code></p>
    </div>
    
    <p><strong>Login URL:</strong> <a href="http://localhost:5173/vendor-login">http://localhost:5173/vendor-login</a></p>
    <p style="color: #ff9800;"><strong>Important:</strong> Change your password after first login</p>
    
    <h3>What you can do:</h3>
    <ul>
      <li>Add products to your assigned categories</li>
      <li>Manage your product inventory</li>
      <li>View and fulfill orders</li>
      <li>Track your sales</li>
    </ul>
    
    <br>
    <p>Best regards,<br>Kash.it Admin Team</p>
  </body>
</html>
'''
    
    thread = Thread(target=send_async_email, args=(app, mail, msg))
    thread.start()
    return thread


def send_order_notification_email(mail, app, order_details):
    """Send order notifications to vendors and admin"""
    from datetime import datetime
    
    # Get unique vendor emails
    vendor_emails = set()
    for item in order_details['items']:
        if item['vendor_email']:
            vendor_emails.add(item['vendor_email'])
    
    # Send to vendors
    for vendor_email in vendor_emails:
        vendor_items = [item for item in order_details['items'] if item['vendor_email'] == vendor_email]
        
        msg = Message(
            subject=f'Kash.it - New Order #{order_details["order_id"]}',
            recipients=[vendor_email]
        )
        
        items_html = ''
        items_text = ''
        vendor_total = 0
        
        for item in vendor_items:
            item_total = item['quantity'] * item['price']
            vendor_total += item_total
            items_html += f'''
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">{item['product_name']}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">{item['quantity']}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹{item['price']}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹{item_total}</td>
            </tr>
            '''
            items_text += f"{item['product_name']} x{item['quantity']} @ ₹{item['price']} = ₹{item_total}\n"
        
        msg.body = f'''
New Order Notification

Order ID: #{order_details['order_id']}
Customer: {order_details['customer_email']}
Order Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}

Your Products:
{items_text}
Subtotal: ₹{vendor_total}

Please log in to your vendor dashboard to manage this order.

Best regards,
Kash.it Team
'''
        
        msg.html = f'''
<html>
  <body>
    <h2>New Order Notification</h2>
    <p><strong>Order ID:</strong> #{order_details['order_id']}</p>
    <p><strong>Customer:</strong> {order_details['customer_email']}</p>
    <p><strong>Order Date:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M')}</p>
    
    <h3>Your Products:</h3>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
            <tr style="background-color: #f5f5f5;">
                <th style="padding: 8px; text-align: left;">Product</th>
                <th style="padding: 8px; text-align: center;">Qty</th>
                <th style="padding: 8px; text-align: right;">Price</th>
                <th style="padding: 8px; text-align: right;">Total</th>
            </tr>
        </thead>
        <tbody>
            {items_html}
        </tbody>
        <tfoot>
            <tr style="background-color: #f5f5f5; font-weight: bold;">
                <td colspan="3" style="padding: 8px; text-align: right;">Subtotal:</td>
                <td style="padding: 8px; text-align: right;">₹{vendor_total}</td>
            </tr>
        </tfoot>
    </table>
    
    <p><strong>Action Required:</strong> Please log in to your vendor dashboard to manage this order.</p>
    <p><a href="http://localhost:5173/vendor-login" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login to Dashboard</a></p>
    
    <br>
    <p>Best regards,<br>Kash.it Team</p>
  </body>
</html>
'''
        
        thread = Thread(target=send_async_email, args=(app, mail, msg))
        thread.start()
    
    # Send to admin (assuming admin email is configured)
    admin_msg = Message(
        subject=f'Kash.it - New Order #{order_details["order_id"]} - Admin Notification',
        recipients=['admin@kashit.com']  # This should be configured
    )
    
    admin_items_html = ''
    admin_items_text = ''
    
    for item in order_details['items']:
        item_total = item['quantity'] * item['price']
        vendor_info = f" (Vendor: {item['vendor_email']})" if item['vendor_email'] else " (Admin Product)"
        admin_items_html += f'''
        <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">{item['product_name']}{vendor_info}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">{item['quantity']}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹{item['price']}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹{item_total}</td>
        </tr>
        '''
        admin_items_text += f"{item['product_name']}{vendor_info} x{item['quantity']} @ ₹{item['price']} = ₹{item_total}\n"
    
    admin_msg.body = f'''
New Order - Admin Notification

Order ID: #{order_details['order_id']}
Customer: {order_details['customer_email']}
Total Amount: ₹{order_details['total_amount']}
Final Amount: ₹{order_details['final_amount']}
Order Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}

All Products:
{admin_items_text}
Total: ₹{order_details['final_amount']}

Best regards,
Kash.it System
'''
    
    admin_msg.html = f'''
<html>
  <body>
    <h2>New Order - Admin Notification</h2>
    <p><strong>Order ID:</strong> #{order_details['order_id']}</p>
    <p><strong>Customer:</strong> {order_details['customer_email']}</p>
    <p><strong>Total Amount:</strong> ₹{order_details['total_amount']}</p>
    <p><strong>Final Amount:</strong> ₹{order_details['final_amount']}</p>
    <p><strong>Order Date:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M')}</p>
    
    <h3>All Products:</h3>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
            <tr style="background-color: #f5f5f5;">
                <th style="padding: 8px; text-align: left;">Product</th>
                <th style="padding: 8px; text-align: center;">Qty</th>
                <th style="padding: 8px; text-align: right;">Price</th>
                <th style="padding: 8px; text-align: right;">Total</th>
            </tr>
        </thead>
        <tbody>
            {admin_items_html}
        </tbody>
        <tfoot>
            <tr style="background-color: #f5f5f5; font-weight: bold;">
                <td colspan="3" style="padding: 8px; text-align: right;">Total:</td>
                <td style="padding: 8px; text-align: right;">₹{order_details['final_amount']}</td>
            </tr>
        </tfoot>
    </table>
    
    <br>
    <p>Best regards,<br>Kash.it System</p>
  </body>
</html>
'''
    
    thread = Thread(target=send_async_email, args=(app, mail, admin_msg))
    thread.start()


def send_delivery_partner_review_email(mail, app, admin_email, partner_email, full_name, phone):
    msg = Message(
        subject='Kash.it - New Delivery Partner Registration',
        recipients=[admin_email]
    )
    body = f"""
New delivery partner registration pending verification.

Name: {full_name}
Email: {partner_email}
Phone: {phone or '-'}

Please review and verify in the admin dashboard.

— Kash.it System
"""
    html = f"""
<html>
  <body>
    <h2>New Delivery Partner Registration</h2>
    <p><strong>Name:</strong> {full_name}</p>
    <p><strong>Email:</strong> {partner_email}</p>
    <p><strong>Phone:</strong> {phone or '-'}
    <p>Please review and verify in the admin dashboard.</p>
  </body>
</html>
"""
    msg.body = body
    msg.html = html
    thread = Thread(target=send_async_email, args=(app, mail, msg))
    thread.start()
    return thread
