import { Body, Controller, Get, Post, UseGuards, Request, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { MovementsService } from './movement.service';
import { AccountsService } from '../accounts/account.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Movement } from './movement.entity';
import { Console } from 'console';

@Controller('movements')
export class MovementsController {
    constructor(
        private readonly movementsService: MovementsService,
        private readonly accountsService: AccountsService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createMovement(
        @Body() body: { amount: number; gameID?: number },
        @Request() req
    ): Promise<any> {
        const account = await this.accountsService.findByOwnerID(req.user.userId);
        if (!account) {
            throw new NotFoundException('No se encontró cuenta para este usuario');
        }
        // Verificar que el accountID del body coincida con la cuenta del usuario
        // (Para que un usuario no pueda hacer movimientos en cuentas ajenas)

        const newBalance = Number(account.Balance) + Number(body.amount);

        const movement = await this.movementsService.createMovement(
            account.AccountID,
            body.amount,
            body.gameID
        );

        // Actualizar el balance de la cuenta
        const updatedAccount = await this.accountsService.updateBalance(
            account.AccountID,
            newBalance
        );

        if (!updatedAccount) {
            throw new BadRequestException('Cuenta inexistente');
        }

        return {
            message: 'Movimiento registrado correctamente',
            movement: {
                MovementID: movement.MovementID,
                Balance: movement.Balance,
                GameID: movement.GameID,
                RegisteredAt: movement.RegisteredAt
            },
            account: {
                AccountID: updatedAccount.AccountID,
                Balance: updatedAccount.Balance
            }
        };
    }

    // Obtener todos los movimientos de la cuenta del usuario autenticado
    @UseGuards(JwtAuthGuard)
    @Get('my-movements')
    async getMyMovements(@Request() req): Promise<any> {
        // Buscar la cuenta del usuario
        const account = await this.accountsService.findByOwnerID(req.user.userId);
        console.log('User ID:', req.user.userId)
        if (!account) {
            throw new NotFoundException('No se encontró cuenta para este usuario');
        }

        // Obtener movimientos
        const movements = await this.movementsService.getMovementsByAccount(account.AccountID);

        return {
            accountID: account.AccountID,
            currentBalance: account.Balance,
            movements: movements
        };
    }

    // Obtener movimientos de cualquier cuenta (solo admin)
    @UseGuards(JwtAuthGuard)
    @Get(':accountID')
    async getMovementsByAccount(
        @Request() req,
        @Body() body: { accountID: number }
    ): Promise<Movement[]> {
        // Solo admins pueden ver movimientos de otras cuentas
        if (req.user.UserType !== 0 && req.user.UserType !== 2) {
            throw new UnauthorizedException('Solo administradores pueden ver movimientos de otras cuentas');
        }

        return this.movementsService.getMovementsByAccount(body.accountID);
    }
}