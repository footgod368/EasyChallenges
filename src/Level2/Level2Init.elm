module Level2Init exposing (init)

{-| Init of Level2 Model.


# init

@docs init

-}

import Array
import Boundary
import Brick
import Browser.Dom exposing (getViewport)
import EndPoint
import Event
import GlobalBasics
import Level2Type
import MainType
import Monster
import Needle
import NoticeBoard
import Player
import SavePoint
import Task


{-| `init` of Level2 \`Model
-}
init : ( Level2Type.Model, Cmd MainType.Msg )
init =
    let
        newModel =
            { windowBoundary = ( 1000.0, 800.0 )
            , levelBoundary = ( 80 * 40, 680.0 )
            , actEvent = Array.fromList []
            , event =
                Array.fromList
                    [
                    ]
            , boundary = Boundary.normalInit
            , player = Player.init ( 50.0, 490.0 )
            , bricks =
                Array.fromList
                    (List.concat
                        [ 
                            Brick.initRow 15 1 14
                        ,  [ Brick.init 
                                    (GlobalBasics.blockPos (8,14) )
                                    (Brick.Detailed 40 40 "#00BFFF")
                                    (Brick.Visible (Brick.InvisibleAfterEvent 1 Brick.NoNextBrickVisibility))
                                    (Brick.NoCollide Brick.NoNextBrickCollision)
                                    (Brick.NoNextBrickMove)]
                        ,  [ Brick.init 
                                    (GlobalBasics.blockPos (8,14) )
                                    (Brick.Detailed 40 40 "#708090")
                                    (Brick.Invisible (Brick.VisibleAfterEvent 1 Brick.NoNextBrickVisibility))
                                    (Brick.NoCollide Brick.NoNextBrickCollision)
                                    (Brick.NoNextBrickMove)]
                        ]
                    )
            , savePoints =
                Array.fromList
                    [         SavePoint.init (GlobalBasics.blockPos ( 2, 14 ))            ]
            , endPoint = EndPoint.init (GlobalBasics.blockPos ( 76, 14 ))
            , noticeBoards =
                Array.fromList
                    [                     ]
            , needles =
                Array.fromList
                    (List.concat
                        [ 
                        ]
                    )
            , monsters =
                Array.fromList
                    [ 
                    ]
            , keyPressed = []
            }
    in
    ( newModel, Task.perform MainType.GetViewport getViewport )
